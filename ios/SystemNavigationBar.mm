#import "SystemNavigationBar.h"

#import <React/RCTUtils.h>
#import <UIKit/UIKit.h>
#import <objc/runtime.h>

// Module state. Mutated exclusively on the main queue; read on the main
// thread by the UIKit override IMPs below, so no additional locking is needed.
static BOOL gHomeIndicatorHidden = NO;
static BOOL gDeferEdgeGestures = NO;

static NSString *const RNSNBSubclassSuffix = @"_RNSystemNavigationBar";

// The overrides only answer while this module is actively requesting something.
// Otherwise they defer to the original implementation, so an app or another
// library keeps control of the home indicator and of child delegation.
// Returns the implementation the view controller would use without this
// module's override. Walking past every class that resolves to `ours` — rather
// than to the instance's immediate superclass — keeps this correct when another
// isa-swizzle (KVO, for one) layers a subclass below ours, where a naive super
// lookup would find this very function and recurse until the stack overflows.
static IMP RNSNBInheritedImplementation(id self, SEL _cmd, IMP ours)
{
  for (Class cls = object_getClass(self); cls != Nil; cls = class_getSuperclass(cls)) {
    IMP imp = class_getMethodImplementation(cls, _cmd);
    if (imp != ours) {
      return imp;
    }
  }
  return NULL;
}

static BOOL RNSNBPrefersHomeIndicatorAutoHidden(id self, SEL _cmd)
{
  if (gHomeIndicatorHidden) {
    return YES;
  }
  IMP inherited =
      RNSNBInheritedImplementation(self, _cmd, (IMP)RNSNBPrefersHomeIndicatorAutoHidden);
  return inherited == NULL ? NO : ((BOOL (*)(id, SEL))inherited)(self, _cmd);
}

static UIRectEdge RNSNBPreferredScreenEdgesDeferringSystemGestures(id self, SEL _cmd)
{
  if (gDeferEdgeGestures) {
    return UIRectEdgeAll;
  }
  IMP inherited = RNSNBInheritedImplementation(
      self, _cmd, (IMP)RNSNBPreferredScreenEdgesDeferringSystemGestures);
  return inherited == NULL ? UIRectEdgeNone
                           : ((UIRectEdge (*)(id, SEL))inherited)(self, _cmd);
}

static UIViewController *RNSNBChildForHomeIndicator(id self, SEL _cmd)
{
  if (gHomeIndicatorHidden) {
    return nil;
  }
  IMP inherited = RNSNBInheritedImplementation(self, _cmd, (IMP)RNSNBChildForHomeIndicator);
  return inherited == NULL ? nil : ((UIViewController * (*)(id, SEL))inherited)(self, _cmd);
}

static UIViewController *RNSNBChildForScreenEdges(id self, SEL _cmd)
{
  if (gDeferEdgeGestures) {
    return nil;
  }
  IMP inherited = RNSNBInheritedImplementation(self, _cmd, (IMP)RNSNBChildForScreenEdges);
  return inherited == NULL ? nil : ((UIViewController * (*)(id, SEL))inherited)(self, _cmd);
}

static UIViewController *RNSNBRootViewController(void)
{
  UIWindow *window = RCTKeyWindow();
  if (window == nil) {
    for (UIScene *scene in UIApplication.sharedApplication.connectedScenes) {
      if (![scene isKindOfClass:UIWindowScene.class]) {
        continue;
      }
      for (UIWindow *candidate in ((UIWindowScene *)scene).windows) {
        if (candidate.rootViewController != nil) {
          window = candidate;
          break;
        }
      }
      if (window != nil) {
        break;
      }
    }
  }
  return window.rootViewController;
}

// UIKit resolves the home-indicator and gesture preferences from the topmost
// presented view controller, so a modal above the root has to be covered too.
static NSArray<UIViewController *> *RNSNBPreferenceViewControllers(void)
{
  NSMutableArray<UIViewController *> *controllers = [NSMutableArray array];
  UIViewController *controller = RNSNBRootViewController();
  while (controller != nil) {
    [controllers addObject:controller];
    controller = controller.presentedViewController;
  }
  return controllers;
}

// Isa-swizzles the given view controller (the same technique KVO uses):
// a runtime subclass of that instance's class overrides the home-indicator
// hooks, so no app-level UIViewController subclass or setup is required.
// Only this one instance is affected.
static void RNSNBInstallDynamicSubclass(UIViewController *viewController)
{
  Class currentClass = object_getClass(viewController);
  NSString *currentName = NSStringFromClass(currentClass);
  if ([currentName hasSuffix:RNSNBSubclassSuffix]) {
    return;
  }

  NSString *subclassName = [currentName stringByAppendingString:RNSNBSubclassSuffix];
  Class subclass = objc_getClass(subclassName.UTF8String);
  if (subclass == Nil) {
    subclass = objc_allocateClassPair(currentClass, subclassName.UTF8String, 0);
    if (subclass == Nil) {
      return;
    }

    Method homeIndicator =
        class_getInstanceMethod(currentClass, @selector(prefersHomeIndicatorAutoHidden));
    class_addMethod(subclass,
                    @selector(prefersHomeIndicatorAutoHidden),
                    (IMP)RNSNBPrefersHomeIndicatorAutoHidden,
                    method_getTypeEncoding(homeIndicator));

    Method screenEdges =
        class_getInstanceMethod(currentClass, @selector(preferredScreenEdgesDeferringSystemGestures));
    class_addMethod(subclass,
                    @selector(preferredScreenEdgesDeferringSystemGestures),
                    (IMP)RNSNBPreferredScreenEdgesDeferringSystemGestures,
                    method_getTypeEncoding(screenEdges));

    Method homeIndicatorChild =
        class_getInstanceMethod(currentClass, @selector(childViewControllerForHomeIndicatorAutoHidden));
    class_addMethod(subclass,
                    @selector(childViewControllerForHomeIndicatorAutoHidden),
                    (IMP)RNSNBChildForHomeIndicator,
                    method_getTypeEncoding(homeIndicatorChild));

    Method screenEdgesChild =
        class_getInstanceMethod(currentClass, @selector(childViewControllerForScreenEdgesDeferringSystemGestures));
    class_addMethod(subclass,
                    @selector(childViewControllerForScreenEdgesDeferringSystemGestures),
                    (IMP)RNSNBChildForScreenEdges,
                    method_getTypeEncoding(screenEdgesChild));

    objc_registerClassPair(subclass);
  }

  if (class_getSuperclass(subclass) == currentClass) {
    object_setClass(viewController, subclass);
  }
}

static void RNSNBApplyStateOnMainQueue(void (^mutateState)(void), RCTPromiseResolveBlock resolve)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    mutateState();

    for (UIViewController *controller in RNSNBPreferenceViewControllers()) {
      RNSNBInstallDynamicSubclass(controller);
      [controller setNeedsUpdateOfHomeIndicatorAutoHidden];
      [controller setNeedsUpdateOfScreenEdgesDeferringSystemGestures];
    }

    resolve(nil);
  });
}

@implementation SystemNavigationBar

- (void)hide:(NSString *)bar
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject
{
  resolve(nil);
}

- (void)show:(NSString *)bar
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject
{
  resolve(nil);
}

- (void)setImmersive:(NSString *)mode
             enabled:(BOOL)enabled
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject
{
  resolve(nil);
}

- (void)setHomeIndicatorAutoHidden:(BOOL)enabled
                           resolve:(RCTPromiseResolveBlock)resolve
                            reject:(RCTPromiseRejectBlock)reject
{
  RNSNBApplyStateOnMainQueue(^{
    gHomeIndicatorHidden = enabled;
  }, resolve);
}

- (void)setSystemGesturesDeferred:(BOOL)enabled
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject
{
  RNSNBApplyStateOnMainQueue(^{
    gDeferEdgeGestures = enabled;
  }, resolve);
}

- (void)setBarStyle:(NSString *)style
                bar:(NSString *)bar
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
  resolve(nil);
}

- (void)setBarColor:(double)color
        translucent:(BOOL)translucent
              style:(NSString *)style
                bar:(NSString *)bar
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
  resolve(nil);
}

- (void)getBarColor:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
  // iOS has no colored system bars; report them as fully transparent so
  // the value still round-trips through setBarColor.
  resolve(@{ @"status" : @"#00000000", @"navigation" : @"#00000000" });
}

- (void)setDividerColor:(double)color
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject
{
  resolve(nil);
}

- (void)setContrastEnforced:(BOOL)enabled
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject
{
  resolve(nil);
}

- (void)setEdgeToEdge:(BOOL)enabled
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject
{
  resolve(nil);
}

- (void)isEdgeToEdgeEnabled:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject
{
  // iOS always lays content out under the system UI; there is nothing to
  // toggle, which is why setEdgeToEdge is a no-op here.
  resolve(@YES);
}

- (void)getNavigationMode:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject
{
  resolve(@"gesture");
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeSystemNavigationBarSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"SystemNavigationBar";
}

@end

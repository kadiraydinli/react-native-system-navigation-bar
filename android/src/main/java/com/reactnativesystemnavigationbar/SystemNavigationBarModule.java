package com.reactnativesystemnavigationbar;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

import android.app.Activity;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.IllegalViewOperationException;
import java.util.HashMap;
import java.util.Map;

@ReactModule(name = SystemNavigationBarModule.NAME)
public class SystemNavigationBarModule extends ReactContextBaseJavaModule {

  public static final String NAME = "NavigationBar";
  public static final int NO_MODE = -1;
  public static final int LIGHT = 0;
  public static final int DARK = 1;
  public static final int NAVIGATION_BAR = 2;
  public static final int STATUS_BAR = 3;
  public static final int NAVIGATION_BAR_STATUS_BAR = 4;

  public SystemNavigationBarModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("NO_MODE", NO_MODE);
    constants.put("LIGHT", LIGHT);
    constants.put("DARK", DARK);
    constants.put("NAVIGATION_BAR", NAVIGATION_BAR);
    constants.put("STATUS_BAR", STATUS_BAR);
    constants.put("NAVIGATION_BAR_STATUS_BAR", NAVIGATION_BAR_STATUS_BAR);
    return constants;
  }

  /* Navigation Hide */
  @ReactMethod
  public void navigationHide(Promise promise) {
    setSystemUIFlags(
      View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
      View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
      View.SYSTEM_UI_FLAG_HIDE_NAVIGATION,
      promise
    );
  }

  /* Navigation Show */
  @ReactMethod
  public void navigationShow(Promise promise) {
    setSystemUIFlags(View.SYSTEM_UI_FLAG_VISIBLE, promise);
  }

  @ReactMethod
  public void fullScreen(Boolean enable, Promise promise) {
    if (enable) {
      setSystemUIFlags(
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
        View.SYSTEM_UI_FLAG_IMMERSIVE |
        View.SYSTEM_UI_FLAG_FULLSCREEN,
        promise
      );
    } else {
      setSystemUIFlags(
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN,
        promise
      );
    }
  }

  /* Lean Back */
  @ReactMethod
  public void leanBack(Promise promise) {
    setSystemUIFlags(
      View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION,
      promise
    );
  }

  /* Immersive */
  @ReactMethod
  public void immersive(Promise promise) {
    setSystemUIFlags(
      View.SYSTEM_UI_FLAG_IMMERSIVE |
      View.SYSTEM_UI_FLAG_FULLSCREEN |
      View.SYSTEM_UI_FLAG_HIDE_NAVIGATION,
      promise
    );
  }

  /* Sticky Immersive */
  @ReactMethod
  public void stickyImmersive(Promise promise) {
    setSystemUIFlags(
      View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
      View.SYSTEM_UI_FLAG_FULLSCREEN |
      View.SYSTEM_UI_FLAG_HIDE_NAVIGATION,
      promise
    );
  }

  /* Low Profile */
  @ReactMethod
  public void lowProfile(Promise promise) {
    setSystemUIFlags(View.SYSTEM_UI_FLAG_LOW_PROFILE, promise);
  }

  @ReactMethod
  public void setBarMode(Integer modeStyle, Integer bar, Promise promise) {
    Boolean isLight = modeStyle.equals(LIGHT);
    setModeStyle(!isLight, bar, promise);
  }

  /* Set Navigation Color */
  @ReactMethod
  public void setNavigationColor(
    Integer color,
    Boolean isTranslucent,
    Integer modeStyle,
    Integer bar,
    Promise promise
  ) {
    try {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
        promise.reject("Error: ", "false");
        return;
      }
      final Activity currentActivity = getCurrentActivity();
      if (currentActivity == null) {
        promise.reject("Error: ", "false");
        return;
      }
      final Window view = currentActivity.getWindow();

      runOnUiThread(
        () -> {
          view.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
          view.clearFlags(
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
          );

          if (color.equals(0)) {
            view.setFlags(
              WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
              WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
            );
          } else if (isTranslucent) {
            view.setFlags(
              WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION,
              WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
            );
          }

          if (Build.VERSION.SDK_INT >= 19 && Build.VERSION.SDK_INT < 21) {
            WindowManager.LayoutParams winParams = view.getAttributes();
            int bit =
              WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS |
              WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION;
            if (modeStyle != NO_MODE) {
              if (modeStyle.equals(LIGHT)) {
                winParams.flags |= bit;
              } else {
                winParams.flags &= ~bit;
              }
            }
            view.setAttributes(winParams);
          }

          if (Build.VERSION.SDK_INT >= 21) {
            view.setNavigationBarColor(color);
          }

          if (modeStyle != NO_MODE) {
            Boolean isLight = modeStyle.equals(LIGHT);
            setModeStyle(!isLight, bar, promise);
          }
        }
      );
      promise.resolve("true");
    } catch (IllegalViewOperationException e) {
      e.printStackTrace();
      promise.reject("Error: ", "false");
    }
  }

  /* Set NavigationBar Divider Color */
  @ReactMethod
  public void setNavigationBarDividerColor(Integer color, Promise promise) {
    try {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
        promise.reject("Error: ", "false");
        return;
      }
      final Activity currentActivity = getCurrentActivity();
      if (currentActivity == null) {
        promise.reject("Error: ", "false");
        return;
      }
      final Window view = currentActivity.getWindow();
      runOnUiThread(
        () -> {
          if (Build.VERSION.SDK_INT >= 28) {
            view.setNavigationBarDividerColor(color);
            view
              .getDecorView()
              .setSystemUiVisibility(
                WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS |
                WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
              );
          }
        }
      );
      promise.resolve("true");
    } catch (IllegalViewOperationException e) {
      e.printStackTrace();
      promise.reject("Error: ", "false");
    }
  }

  /* Set NavigationBar Contrast Enforced */
  @ReactMethod
  public void setNavigationBarContrastEnforced(
    Boolean enforceContrast,
    Promise promise
  ) {
    try {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
        promise.reject("Error: ", "false");
        return;
      }
      final Activity currentActivity = getCurrentActivity();
      if (currentActivity == null) {
        promise.reject("Error: ", "false");
        return;
      }
      final Window view = currentActivity.getWindow();
      runOnUiThread(
        () -> {
          if (Build.VERSION.SDK_INT >= 29) {
            view.setNavigationBarContrastEnforced(enforceContrast);
          }
        }
      );
      promise.resolve("true");
    } catch (IllegalViewOperationException e) {
      e.printStackTrace();
      promise.reject("Error: ", "false");
    }
  }

  /* Private Method */
  private void setSystemUIFlags(int visibility, Promise promise) {
    try {
      runOnUiThread(
        () -> {
          if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            promise.reject("Error: ", "false");
            return;
          }
          Activity currentActivity = getCurrentActivity();
          if (currentActivity == null) {
            promise.reject("Error: ", "false");
            return;
          }
          View decorView = currentActivity.getWindow().getDecorView();

          decorView.setSystemUiVisibility(visibility);
        }
      );
      promise.resolve("true");
    } catch (IllegalViewOperationException e) {
      e.printStackTrace();
      promise.reject("Error: ", "false");
    }
  }

  private void setBarStyle(Boolean light, int visibility) {
    View decorView = getCurrentActivity().getWindow().getDecorView();
    int bit = decorView.getSystemUiVisibility();

    if (light) {
      bit |= visibility;
    } else {
      bit &= ~visibility;
    }

    decorView.setSystemUiVisibility(bit);
  }

  private void setModeStyle(Boolean light, Integer bar, Promise promise) {
    try {
      runOnUiThread(
        () -> {
          if (Build.VERSION.SDK_INT >= 26) {
            if (getCurrentActivity() == null) {
              promise.reject("Error: ", "false");
              return;
            }

            if (bar.equals(NAVIGATION_BAR)) {
              setBarStyle(light, View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
            } else if (bar.equals(STATUS_BAR)) {
              setBarStyle(light, View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            } else if (bar.equals(NAVIGATION_BAR_STATUS_BAR)) {
              setBarStyle(light, View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            }

            promise.resolve("true");
          }
        }
      );
    } catch (IllegalViewOperationException e) {
      promise.reject("Error: ", "false");
    }
  }
}

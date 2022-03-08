package com.reactnativesystemnavigationbar;

import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.IllegalViewOperationException;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

@ReactModule(name = SystemNavigationBarModule.NAME)
public class SystemNavigationBarModule extends ReactContextBaseJavaModule {
    public static final String NAME = "NavigationBar";

    public SystemNavigationBarModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    /* Navigation Hide */
    @ReactMethod
    public void navigationHide(Promise promise) {
        setSystemUIFlags(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION,
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
        setSystemUIFlags(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION, promise);
    }

    /* Immersive */
    @ReactMethod
    public void immersive(Promise promise) {
        setSystemUIFlags(View.SYSTEM_UI_FLAG_IMMERSIVE | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION, promise);
    }

    /* Sticky Immersive */
    @ReactMethod
    public void stickyImmersive(Promise promise) {
        setSystemUIFlags(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION, promise);
    }

    /* Low Profile */
    @ReactMethod
    public void lowProfile(Promise promise) {
        setSystemUIFlags(View.SYSTEM_UI_FLAG_LOW_PROFILE, promise);
    }

    @ReactMethod
    public void lightNavigationBar(Boolean light, Promise promise) {
        lightDarkMode(!light, promise);
    }

    /* Set Navigation Color */
    @ReactMethod
    public void setNavigationColor(Integer color, Boolean isTranslucent, Boolean light, Promise promise) {
        try {
            if (getCurrentActivity().getWindow() == null) {
                Log.d("TAG", "setNavigationColor: ");
                promise.reject("Error: ", "false");
                return;
            }
            final Window view = getCurrentActivity().getWindow();

            runOnUiThread(() -> {
                view.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
                view.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

                if (color.equals(0)) {
                    view.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
                } else if (isTranslucent) {
                    view.setFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION, WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
                }

                if (Build.VERSION.SDK_INT >= 19 && Build.VERSION.SDK_INT < 21) {
                    WindowManager.LayoutParams winParams = view.getAttributes();
                    int bit = WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION;
                    if (light) {
                        winParams.flags |= bit;
                    } else {
                        winParams.flags &= ~bit;
                    }
                    view.setAttributes(winParams);
                }

                if (Build.VERSION.SDK_INT >= 19) {
                    int visibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
                    visibility = visibility | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
                    view.getDecorView().setSystemUiVisibility(visibility);
                }

                if (Build.VERSION.SDK_INT >= 21) {
                    view.setNavigationBarColor(color.intValue());
                }

                lightDarkMode(!light, promise);
            });
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
            if (getCurrentActivity().getWindow() == null) {
                Log.d("TAG", "setNavigationColor: ");
                promise.reject("Error: ", "false");
                return;
            }
            final Window view = getCurrentActivity().getWindow();
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 28) {
                    view.setNavigationBarDividerColor(color.intValue());
                    view.getDecorView().setSystemUiVisibility(
                            WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS |
                                    WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
                    );
                }
            });
            promise.resolve("true");
        } catch (IllegalViewOperationException e) {
            e.printStackTrace();
            promise.reject("Error: ", "false");
        }
    }

    /* Set NavigationBar Contrast Enforced */
    @ReactMethod
    public void setNavigationBarContrastEnforced(Boolean enforceContrast, Promise promise) {
        try {
            if (getCurrentActivity().getWindow() == null) {
                Log.d("TAG", "setNavigationColor: ");
                promise.reject("Error: ", "false");
                return;
            }
            final Window view = getCurrentActivity().getWindow();
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 29) {
                    view.setNavigationBarContrastEnforced(enforceContrast);
                }
            });
            promise.resolve("true");
        } catch (IllegalViewOperationException e) {
            e.printStackTrace();
            promise.reject("Error: ", "false");
        }
    }

    /* Private Method */
    private void setSystemUIFlags(int visibility, Promise promise) {
        try {
            runOnUiThread(() -> {
                if (getCurrentActivity().getWindow() == null) {
                    Log.d("TAG", "setNavigationColor: ");
                    promise.reject("Error: ", "false");
                    return;
                }
                View decorView = getCurrentActivity().getWindow().getDecorView();

                decorView.setSystemUiVisibility(visibility);
            });
            promise.resolve("true");
        } catch (IllegalViewOperationException e) {
            e.printStackTrace();
            promise.reject("Error: ", "false");
        }
    }

    private void lightDarkMode(Boolean light, Promise promise) {
        try {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 26) {
                    if (getCurrentActivity().getWindow() == null) {
                        Log.d("TAG", "setNavigationColor: ");
                        promise.reject("Error: ", "false");
                        return;
                    }
                    View decorView = getCurrentActivity().getWindow().getDecorView();
                    int bit = View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;

                    if (light) {
                        bit |= bit;
                    } else {
                        bit &= ~bit;
                    }
                    decorView.setSystemUiVisibility(bit);

                    promise.resolve("true");
                }
            });

        } catch (IllegalViewOperationException e) {
            promise.reject("Error: ", "false");
        }
    }
}

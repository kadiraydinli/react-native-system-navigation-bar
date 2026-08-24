package com.systemnavigationbar

import android.graphics.Color
import android.os.Build
import android.provider.Settings
import android.view.Window
import android.view.WindowInsetsController
import android.view.WindowManager
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule
import java.util.Locale

@ReactModule(name = SystemNavigationBarModule.NAME)
class SystemNavigationBarModule(reactContext: ReactApplicationContext) :
  NativeSystemNavigationBarSpec(reactContext) {

  /**
   * The window whose [setEdgeToEdge] request is reflected by
   * [isEdgeToEdgeEnabled]. Identity is compared so the request does not leak
   * into a window created by an Activity restart, and the platform offers no
   * getter to read the flag back.
   */
  private var edgeToEdgeWindow: Int? = null

  // hide() and show() own the window-wide bars behavior: they reset it to the
  // platform default, under which a hidden bar returns on an edge swipe and
  // stays put. An immersive mode is a separate, explicitly entered state; these
  // two end it, so no window state has to be mirrored in this module.
  override fun hide(bar: String, promise: Promise) = withWindow(promise) { window ->
    val controller = insetsControllerOf(window)
    controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_DEFAULT
    controller.hide(insetTypesOf(bar))
  }

  override fun show(bar: String, promise: Promise) = withWindow(promise) { window ->
    val controller = insetsControllerOf(window)
    controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_DEFAULT
    controller.show(insetTypesOf(bar))
  }

  // BEHAVIOR_SHOW_BARS_BY_TOUCH is the lean-back behavior: any touch brings the
  // bars back. It is deprecated since API 31, where the platform falls back to
  // revealing the bars by swipe instead.
  @Suppress("DEPRECATION")
  override fun setImmersive(mode: String, enabled: Boolean, promise: Promise) =
    withWindow(promise) { window ->
      val controller = insetsControllerOf(window)
      val bothBars = insetTypesOf(BAR_BOTH)

      if (!enabled) {
        controller.show(bothBars)
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_DEFAULT
      } else {
        val behavior = when (mode) {
          MODE_LEAN_BACK -> WindowInsetsControllerCompat.BEHAVIOR_SHOW_BARS_BY_TOUCH
          MODE_IMMERSIVE -> WindowInsetsControllerCompat.BEHAVIOR_DEFAULT
          MODE_STICKY -> WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
          else -> throw IllegalArgumentException("Unknown immersive mode: $mode")
        }
        controller.hide(bothBars)
        controller.systemBarsBehavior = behavior
      }
    }

  override fun setBarStyle(style: String, bar: String, promise: Promise) =
    withWindow(promise) { window ->
      applyBarAppearance(window, darkIcons = style == "dark", bar = bar)
    }

  // Window bar color APIs are deprecated since API 35 but still take effect
  // below API 35 and whenever edge-to-edge is not enforced.
  @Suppress("DEPRECATION")
  override fun setBarColor(
    color: Double,
    translucent: Boolean,
    style: String,
    bar: String,
    promise: Promise,
  ) = withWindow(promise) { window ->
    val colorInt = color.toLong().toInt()
    val targetsStatus = bar != BAR_NAVIGATION
    val targetsNavigation = bar != BAR_STATUS

    // A translucent bar is drawn by the platform, which ignores any color set
    // on the window — so the color is cleared instead of left stale, keeping
    // getBarColor's answer truthful.
    if (targetsStatus) {
      window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
      if (translucent) {
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
      }
      window.statusBarColor = if (translucent) Color.TRANSPARENT else colorInt
    }
    if (targetsNavigation) {
      window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
      if (translucent) {
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
      }
      window.navigationBarColor = if (translucent) Color.TRANSPARENT else colorInt
    }
    if (style == "light" || style == "dark") {
      applyBarAppearance(window, darkIcons = style == "dark", bar = bar)
    }
  }

  @Suppress("DEPRECATION")
  override fun getBarColor(promise: Promise) = withWindow(promise) { window ->
    Arguments.createMap().apply {
      putString("status", toHexColor(window.statusBarColor))
      putString("navigation", toHexColor(window.navigationBarColor))
    }
  }

  // The divider arrived in API 28 and contrast enforcement in API 29, both above
  // this library's minSdk. On older devices the call resolves without doing
  // anything rather than rejecting, so callers never need a version check.
  @Suppress("DEPRECATION")
  override fun setDividerColor(color: Double, promise: Promise) = withWindow(promise) { window ->
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      window.navigationBarDividerColor = color.toLong().toInt()
    }
  }

  override fun setContrastEnforced(enabled: Boolean, promise: Promise) =
    withWindow(promise) { window ->
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        window.isNavigationBarContrastEnforced = enabled
      }
    }

  override fun setEdgeToEdge(enabled: Boolean, promise: Promise) = withWindow(promise) { window ->
    WindowCompat.setDecorFitsSystemWindows(window, !enabled)
    edgeToEdgeWindow = if (enabled) System.identityHashCode(window) else null
  }

  override fun isEdgeToEdgeEnabled(promise: Promise) {
    val requested = edgeToEdgeWindow != null &&
      edgeToEdgeWindow == currentActivity?.window?.let(System::identityHashCode)
    promise.resolve(isEdgeToEdgeEnforced() || requested)
  }

  override fun setHomeIndicatorAutoHidden(enabled: Boolean, promise: Promise) {
    promise.resolve(null)
  }

  override fun setSystemGesturesDeferred(enabled: Boolean, promise: Promise) {
    promise.resolve(null)
  }

  override fun getNavigationMode(promise: Promise) {
    val mode = Settings.Secure.getInt(
      reactApplicationContext.contentResolver,
      "navigation_mode",
      0,
    )
    promise.resolve(
      when (mode) {
        1 -> "two-button"
        2 -> "gesture"
        else -> "three-button"
      }
    )
  }

  /**
   * Runs [block] on the UI thread against the current activity's window and
   * settles [promise] exactly once: with the block's value (Unit maps to null)
   * or with the thrown exception.
   */
  private fun withWindow(promise: Promise, block: (Window) -> Any?) {
    val activity = currentActivity
    if (activity == null) {
      promise.reject("E_NO_ACTIVITY", "Cannot change system bars: no current Activity.")
      return
    }
    UiThreadUtil.runOnUiThread {
      try {
        val result = block(activity.window)
        promise.resolve(if (result == Unit) null else result)
      } catch (e: IllegalArgumentException) {
        promise.reject("E_INVALID_ARGUMENT", e.message, e)
      } catch (e: Exception) {
        promise.reject("E_UNKNOWN", e.message, e)
      }
    }
  }

  private fun isEdgeToEdgeEnforced(): Boolean =
    Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM &&
      reactApplicationContext.applicationInfo.targetSdkVersion >=
      Build.VERSION_CODES.VANILLA_ICE_CREAM

  private fun insetsControllerOf(window: Window): WindowInsetsControllerCompat =
    WindowCompat.getInsetsController(window, window.decorView)

  private fun insetTypesOf(bar: String): Int = when (bar) {
    BAR_STATUS -> WindowInsetsCompat.Type.statusBars()
    BAR_NAVIGATION -> WindowInsetsCompat.Type.navigationBars()
    else -> WindowInsetsCompat.Type.statusBars() or WindowInsetsCompat.Type.navigationBars()
  }

  private fun applyBarAppearance(window: Window, darkIcons: Boolean, bar: String) {
    // WindowInsetsControllerCompat may synchronize light-bar appearance through
    // legacy systemUiVisibility flags. On some Android 12+ OEM builds, those flags
    // can diverge from WindowManager's modern appearance, so use the platform
    // controller directly to match React Native on API 31+.
    if (Build.VERSION.SDK_INT > Build.VERSION_CODES.R) {
      // The platform controller only exists once the decor view is attached to a
      // ViewRootImpl. Before that it is null, and falling through to the compat
      // path leaves the legacy flag behind for the platform to apply on attach —
      // resolving the promise without touching the window would turn an early
      // setBarStyle call into a silent no-op.
      val platformController = window.insetsController
      if (platformController != null) {
        val statusBars = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
        val navigationBars = WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
        val mask = when (bar) {
          BAR_STATUS -> statusBars
          BAR_NAVIGATION -> navigationBars
          else -> statusBars or navigationBars
        }
        platformController.setSystemBarsAppearance(
          if (darkIcons) mask else 0,
          mask,
        )
        return
      }
    }

    val controller = insetsControllerOf(window)
    if (bar != BAR_NAVIGATION) controller.isAppearanceLightStatusBars = darkIcons
    if (bar != BAR_STATUS) controller.isAppearanceLightNavigationBars = darkIcons
  }

  /**
   * Formats a color as `#RRGGBB`, or as `#RRGGBBAA` when it is not fully
   * opaque, so translucent bars are distinguishable and the value stays
   * parsable by React Native's color handling.
   */
  private fun toHexColor(color: Int): String {
    val rgb = String.format(Locale.US, "#%06X", 0xFFFFFF and color)
    val alpha = Color.alpha(color)
    return if (alpha == 255) rgb else rgb + String.format(Locale.US, "%02X", alpha)
  }

  companion object {
    const val NAME = NativeSystemNavigationBarSpec.NAME

    private const val BAR_STATUS = "status"
    private const val BAR_NAVIGATION = "navigation"
    private const val BAR_BOTH = "both"

    private const val MODE_LEAN_BACK = "lean-back"
    private const val MODE_IMMERSIVE = "immersive"
    private const val MODE_STICKY = "sticky"
  }
}

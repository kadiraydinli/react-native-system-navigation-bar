# react-native-system-navigation-bar

[![npm version](https://img.shields.io/npm/v/react-native-system-navigation-bar.svg)](https://www.npmjs.com/package/react-native-system-navigation-bar)
[![npm downloads](https://img.shields.io/npm/dm/react-native-system-navigation-bar.svg)](https://www.npmjs.com/package/react-native-system-navigation-bar)
[![license](https://img.shields.io/npm/l/react-native-system-navigation-bar.svg)](LICENSE)

Control the system bars from React Native: hide or show the navigation and status bars, enter immersive modes, style bar icons, set bar colors, and manage edge-to-edge rendering on Android — with home indicator control on iOS.

## Platform support

Android is the primary platform: every API in this library is implemented there, and the Android methods are silent no-ops on iOS. iOS gets two dedicated methods of its own — [`setHomeIndicatorAutoHidden`](#sethomeindicatorautohiddenenabled) and [`setSystemGesturesDeferred`](#setsystemgesturesdeferredenabled) — which are silent no-ops on Android. No method requires a platform check before calling.

**Version 3 supports the New Architecture only** and requires React Native 0.76 or newer. It is implemented as a TurboModule. If your app still runs the old architecture, stay on [v2.8.0](https://github.com/kadiraydinli/react-native-system-navigation-bar/tree/v2.8.0).

## Installation

```sh
npm install react-native-system-navigation-bar
# or
yarn add react-native-system-navigation-bar
```

No extra native setup is required. Rebuild your app after installing.

**Requirements:** React Native 0.76 or newer with the New Architecture (the default since 0.76). The package declares `react-native >= 0.76.0` as a peer dependency, so npm/yarn will warn you at install time if your project is below that.

**On an older React Native or the legacy architecture?** Stay on the v2 line — it remains available and unchanged:

```sh
npm install react-native-system-navigation-bar@2.8.0
```

The v2 documentation is on the [v2.8.0 tag](https://github.com/kadiraydinli/react-native-system-navigation-bar/tree/v2.8.0#readme).

## Quick start

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

// Hide the navigation bar (swipe from the edge to bring it back)
SystemNavigationBar.hide();

// Full-screen video player: hide everything, bars come back briefly on swipe
SystemNavigationBar.setImmersive('sticky');

// Match the bars to your theme
SystemNavigationBar.setBarColor('#0F172A', { style: 'light' });

// iOS: game-style full screen — the first bottom swipe won't background the app
SystemNavigationBar.setSystemGesturesDeferred();
```

## API

All methods return a `Promise` and are available on the default export.

### `hide(bar?)`

```ts
hide(bar?: 'navigation' | 'status' | 'both'): Promise<void>
```

Hides the given system bar(s). Defaults to `'navigation'`. The user brings the bars back by swiping from the corresponding edge, and they stay visible; a tap does not reveal them. `hide` and `show` reset the reveal behavior to the platform default, which also ends an immersive mode entered with [`setImmersive`](#setimmersivemode-enabled). **Android only** — for the iOS home indicator, use [`setHomeIndicatorAutoHidden`](#sethomeindicatorautohiddenenabled). See [WindowInsetsControllerCompat.hide](https://developer.android.com/reference/androidx/core/view/WindowInsetsControllerCompat#hide(int)).

```js
SystemNavigationBar.hide(); // navigation bar only
SystemNavigationBar.hide('status'); // status bar only
SystemNavigationBar.hide('both'); // full screen
```

<img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/main/screenshots/hide.gif?raw=true" width="200" alt="hide demo" />

### `show(bar?)`

```ts
show(bar?: 'navigation' | 'status' | 'both'): Promise<void>
```

Shows the given system bar(s) again. Defaults to `'navigation'`. Like `hide`, it resets the reveal behavior to the platform default. **Android only.** See [WindowInsetsControllerCompat.show](https://developer.android.com/reference/androidx/core/view/WindowInsetsControllerCompat#show(int)).

```js
SystemNavigationBar.show();
SystemNavigationBar.show('both');
```

### `setImmersive(mode, enabled?)`

```ts
setImmersive(mode: 'lean-back' | 'immersive' | 'sticky', enabled?: boolean): Promise<void>
```

Enters (or exits, when `enabled` is `false`) one of Android's immersive full-screen modes. `enabled` defaults to `true`. **Android only** — for the equivalent game-style behavior on iOS, use [`setSystemGesturesDeferred`](#setsystemgesturesdeferredenabled).

| Mode | Behavior on Android |
| --- | --- |
| `'lean-back'` | Bars reappear when the user taps anywhere on the screen. Suited to passive experiences such as video playback. Android 12 (API 31) deprecated this behavior, and devices running it reveal the bars by edge swipe instead. |
| `'immersive'` | Bars reappear when the user swipes from an edge. Suited to interactive full-screen apps. |
| `'sticky'` | Bars appear translucently on swipe and hide again automatically. Suited to games and drawing apps. |

See the Android guide on [immersive modes](https://developer.android.com/develop/ui/views/layout/immersive) for background.

```js
SystemNavigationBar.setImmersive('sticky');
SystemNavigationBar.setImmersive('sticky', false); // exit
```

| Lean back | Immersive | Sticky |
| :---: | :---: | :---: |
| <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/main/screenshots/lean-back.gif?raw=true" width="200" alt="lean-back demo" /> | <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/main/screenshots/immersive.gif?raw=true" width="200" alt="immersive demo" /> | <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/main/screenshots/sticky-immersive.gif?raw=true" width="200" alt="sticky immersive demo" /> |

### `setBarStyle(style, bar?)`

```ts
setBarStyle(style: 'light' | 'dark', bar?: 'navigation' | 'status' | 'both'): Promise<void>
```

Sets the icon style of the system bars. `'light'` means light (white) icons for dark backgrounds; `'dark'` means dark icons for light backgrounds. `bar` defaults to `'both'`. **Android only.** See [setAppearanceLightNavigationBars](https://developer.android.com/reference/androidx/core/view/WindowInsetsControllerCompat#setAppearanceLightNavigationBars(boolean)).

```js
SystemNavigationBar.setBarStyle('dark'); // dark icons on both bars
SystemNavigationBar.setBarStyle('light', 'status'); // light icons on the status bar
```

<img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/main/screenshots/bar-mode.gif?raw=true" width="200" alt="bar style demo" />

### `setBarColor(color, options?)`

```ts
setBarColor(
  color: ColorValue,
  options?: {
    bar?: 'navigation' | 'status' | 'both';
    translucent?: boolean;
    style?: 'light' | 'dark';
  }
): Promise<void>
```

Sets the background color of the system bars. Accepts any React Native color value (`'red'`, `'#FF0000'`, `'#FF0000AA'`, `'hsla(110, 56%, 49%, 0.5)'`, …). Numbers are read as `0xRRGGBBAA`, so an opaque red is `0xff0000ff`. Unsupported values (`PlatformColor`, `DynamicColorIOS`, unparsable strings) reject the promise. `bar` defaults to `'both'`. Pass `style` to set the icon style in the same call. Pass `translucent: true` for a see-through bar — the platform then draws its own scrim, **ignores the `color` argument** for that bar (`getBarColor` reports it as `#00000000`) and, by definition of the platform flag, extends your content underneath that bar. **Android only.** See [Window.setNavigationBarColor](https://developer.android.com/reference/android/view/Window#setNavigationBarColor(int)).

> **Note:** this is a no-op when the OS enforces edge-to-edge — Android 15+ with `targetSdk` 35 or higher — because the system draws the bars fully transparent and ignores app-set colors. See [Android 15+ and edge-to-edge](#android-15-and-edge-to-edge).

`PlatformColor` and `DynamicColorIOS` values cannot be resolved to a single color across the bridge; passing one (or an unparsable string) rejects the promise instead of reaching the native side. The same applies to `setDividerColor`.

```js
SystemNavigationBar.setBarColor('#FF0000');
SystemNavigationBar.setBarColor('#0F172A', { style: 'light' });
SystemNavigationBar.setBarColor('transparent', { bar: 'navigation', translucent: true }); // color ignored
```

<img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/main/screenshots/navigation-color.gif?raw=true" width="200" alt="bar color demo" />

### `getBarColor()`

```ts
getBarColor(): Promise<{ status: string; navigation: string }>
```

Returns the current colors of both bars as hex strings — `#RRGGBB` when a bar is opaque, `#RRGGBBAA` when it is not, so translucent and transparent bars stay distinguishable. The values can be passed straight back to `setBarColor`. On iOS, and when the native module is unavailable, both resolve to `#00000000`.

```js
const { status, navigation } = await SystemNavigationBar.getBarColor();
// { status: '#757575', navigation: '#FF0000' }
```

### `setDividerColor(color)`

```ts
setDividerColor(color: ColorValue): Promise<void>
```

Draws a thin divider line of the given color between the navigation bar and the app content. **Android 9 (API 28) and higher** — a silent no-op on older versions, which have no divider. Ignored under enforced edge-to-edge. See [Window.setNavigationBarDividerColor](https://developer.android.com/reference/android/view/Window#setNavigationBarDividerColor(int)).

```js
SystemNavigationBar.setDividerColor('#CCCCCC');
```

<img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/main/screenshots/divider-color.gif?raw=true" width="200" alt="divider color demo" />

### `setContrastEnforced(enabled)`

```ts
setContrastEnforced(enabled: boolean): Promise<void>
```

Controls whether the system guarantees enough contrast for bar icons when a fully transparent bar background is requested (typically by drawing a subtle scrim behind them). **Android 10 (API 29) and higher** — a silent no-op on older versions, which do not enforce contrast. See [Window.setNavigationBarContrastEnforced](https://developer.android.com/reference/android/view/Window#setNavigationBarContrastEnforced(boolean)).

```js
SystemNavigationBar.setContrastEnforced(false);
```

Coloring a bar does not change how content is laid out — except `translucent: true`, which the platform couples to drawing behind that bar. To draw behind the bars deliberately, call [`setEdgeToEdge(true)`](#setedgetoedgeenabled).

### `setEdgeToEdge(enabled)`

```ts
setEdgeToEdge(enabled: boolean): Promise<void>
```

Enables or disables edge-to-edge rendering: with `true`, your app draws behind the system bars and is responsible for handling insets. **Android only.** On Android 15+ with `targetSdk` 35+, edge-to-edge is enforced by the OS and cannot be turned off. See the [edge-to-edge guide](https://developer.android.com/develop/ui/views/layout/edge-to-edge).

```js
SystemNavigationBar.setEdgeToEdge(true);
```

<img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/main/screenshots/fits-systems-windows.gif?raw=true" width="200" alt="edge-to-edge demo" />

### `isEdgeToEdgeEnabled()`

```ts
isEdgeToEdgeEnabled(): Promise<boolean>
```

Returns whether edge-to-edge is enforced by the OS (Android 15+ with `targetSdk` 35+) or was enabled through `setEdgeToEdge`. Useful for deciding at runtime whether bar color APIs will have any effect. Edge-to-edge that another library or your own native code enabled is not reflected here.

```js
const edgeToEdge = await SystemNavigationBar.isEdgeToEdgeEnabled();
```

### `getNavigationMode()`

```ts
getNavigationMode(): Promise<'gesture' | 'two-button' | 'three-button'>
```

Returns the device's current system navigation mode. In `'gesture'` mode the navigation bar is a thin transparent handle, so coloring it usually makes no visible difference.

```js
const mode = await SystemNavigationBar.getNavigationMode();
```

### `setHomeIndicatorAutoHidden(enabled?)`

```ts
setHomeIndicatorAutoHidden(enabled?: boolean): Promise<void>
```

Requests that iOS auto-hide the home indicator, via [prefersHomeIndicatorAutoHidden](https://developer.apple.com/documentation/uikit/uiviewcontroller/prefershomeindicatorautohidden). Suited to passive, video-player-style experiences. `enabled` defaults to `true`; pass `false` to withdraw the request. **iOS only.** See [iOS and the home indicator](#ios-and-the-home-indicator) for what this does and does not control.

```js
SystemNavigationBar.setHomeIndicatorAutoHidden();
SystemNavigationBar.setHomeIndicatorAutoHidden(false);
```

### `setSystemGesturesDeferred(enabled?)`

```ts
setSystemGesturesDeferred(enabled?: boolean): Promise<void>
```

Defers the system edge gestures via [preferredScreenEdgesDeferringSystemGestures](https://developer.apple.com/documentation/uikit/uiviewcontroller/preferredscreenedgesdeferringsystemgestures): the first swipe from the bottom edge is delivered to your app and only a second swipe backgrounds it — the "swipe twice to exit" behavior of full-screen games and drawing apps. `enabled` defaults to `true`. **iOS only.**

```js
SystemNavigationBar.setSystemGesturesDeferred();
SystemNavigationBar.setSystemGesturesDeferred(false);
```

## Android 15+ and edge-to-edge

Starting with Android 15, apps targeting SDK 35 or higher are displayed edge-to-edge **by default and by force** (see the [Android 15 behavior changes](https://developer.android.com/about/versions/15/behavior-changes-15#edge-to-edge)): the system draws the status and navigation bars over your content with transparent backgrounds, and the window color APIs this library wraps (`setBarColor`, `setDividerColor`, `setContrastEnforced`) are ignored by the OS. This is an Android platform decision, not a library limitation.

What to do instead:

- Call `isEdgeToEdgeEnabled()` at runtime. If it resolves to `true`, skip bar-color logic — the OS will not apply it.
- Call `getNavigationMode()` to adapt your layout: in `'gesture'` mode the navigation area is a small floating handle, while `'three-button'` mode reserves a full-height bar.
- Icon styling still works: use `setBarStyle` to keep icons legible over your content.
- Visibility and immersive APIs (`hide`, `show`, `setImmersive`) are unaffected and keep working under edge-to-edge.

On devices and targets where edge-to-edge is not enforced, all color APIs behave as documented above.

On Android 10 (API 29) and older, hiding a system bar resizes the window, so your layout reflows as the bar disappears. Calling `setEdgeToEdge(true)` keeps the layout stable there, at the cost of handling insets yourself.

## iOS and the home indicator

iOS has no system navigation bar; what this library controls there is the **home indicator** (the line at the bottom of the screen) and the bottom-edge system gesture, through two dedicated methods: `setHomeIndicatorAutoHidden` and `setSystemGesturesDeferred`. A few things to know so the behavior does not surprise you:

- **Hiding is a preference, not a command.** `setHomeIndicatorAutoHidden(true)` sets [prefersHomeIndicatorAutoHidden](https://developer.apple.com/documentation/uikit/uiviewcontroller/prefershomeindicatorautohidden), and Apple documents that the system takes it into account but makes the final call. There is **no API on iOS to force the indicator to stay visible** — passing `false` only withdraws the hide request.
- **On iOS 26 and later, the system auto-hides the indicator in every app** after a moment of inactivity, so `setHomeIndicatorAutoHidden` produces little visible difference there — the OS is already doing what it requests. Its effect is most noticeable on earlier iOS versions, where the indicator otherwise stays visible while the app is in use.
- **Hiding the indicator and deferring the bottom-edge gesture are mutually exclusive.** When the indicator is auto-hidden, iOS treats the app as a passive experience and performs the home gesture on the **first** swipe, ignoring the deferral. Enable one or the other: `setHomeIndicatorAutoHidden` for video-style experiences, `setSystemGesturesDeferred` for game-style "swipe twice to exit". Enabling both leaves you with the indicator-hiding behavior.
- **Test on a physical device.** The iOS Simulator does not reproduce these reliably: mouse swipes often bypass gesture deferral, and the indicator's fade behavior differs from hardware.
- **The preference is applied to the view controllers on screen when you call it** — the window's root and anything presented above it, such as a React Native `Modal`. Present a modal *after* the call and it starts with the system default; call the method again once it is on screen.
- Everything else — bar visibility, immersive modes, colors, styles, divider, edge-to-edge — is a silent no-op on iOS; the status bar belongs to React Native's own [StatusBar](https://reactnative.dev/docs/statusbar) API. The two queries still answer platform truths rather than no-oping: `isEdgeToEdgeEnabled()` resolves `true` because iOS always lays content out under the system UI, and `getBarColor()` resolves `#00000000` for both bars since iOS has no colored system bars.

## Migrating from v2

v3 is a rewrite as a New Architecture TurboModule with a smaller, more consistent API. The v2 method names still work as deprecated aliases — they log a deprecation warning in development and will be removed in v4 — so you can upgrade first and rename incrementally.

| v2 call | v3 equivalent |
| --- | --- |
| `navigationHide()` | `hide()` |
| `navigationShow()` | `show()` |
| `fullScreen(true)` / `fullScreen(false)` | `hide('both')` / `show('both')` |
| `leanBack(enabled)` | `setImmersive('lean-back', enabled)` |
| `immersive()` | `setImmersive('immersive')` — v2 had no way to leave this mode; pass `false` to the new method to exit |
| `stickyImmersive(enabled)` | `setImmersive('sticky', enabled)` |
| `setBarMode(style, bar)` | `setBarStyle(style, bar)` — with no `style`, v2 applied dark icons, and the alias keeps that default |
| `setNavigationColor(color, style, bar)` | `setBarColor(color, { bar: 'navigation' })` plus `setBarStyle(style, bar)` — `setBarColor` colors **both** bars by default, while v2 colored only the navigation bar |
| `setNavigationColor('translucent')` | `setBarColor(color, { translucent: true })` |
| `setNavigationBarDividerColor(color)` | `setDividerColor(color)` |
| `setNavigationBarContrastEnforced(enabled)` | `setContrastEnforced(enabled)` |
| `setFitsSystemWindows(fits)` | `setEdgeToEdge(!fits)` |
| `setNavigationColor('transparent')` also laid content out behind the bars | `setBarColor('transparent', …)` colors only; add `setEdgeToEdge(true)` for the layout change |
| `lowProfile()` | **Removed.** It has been a no-op on Android 11+ and there is no modern replacement. |

Behavior change: `getBarColor()` no longer takes a bar argument and **always returns an object** — `{ status, navigation }` — instead of a single string for `'status'`/`'navigation'`. Passing the old argument logs a deprecation warning in development.

## FAQ

**Why doesn't `setBarColor` change anything on my device?**
Two common reasons. On Android 15+ with `targetSdk` 35+, the OS enforces edge-to-edge and ignores app-set bar colors entirely — check with `isEdgeToEdgeEnabled()`. And in gesture navigation mode the navigation "bar" is just a thin transparent handle over your content, so a color change is barely visible — check with `getNavigationMode()`.

**Why is my navigation bar color semi-transparent in three-button navigation?**
On Android 15+ with `targetSdk` 35+, the OS owns the bar background. In three-button mode it takes the requested color but composites it as a translucent scrim over your content; with `setContrastEnforced(false)` it draws nothing at all, and in gesture mode the color is ignored entirely. There is no app-side setting for a fully opaque bar on those versions. On Android 14 and below, colors apply fully opaque as documented.

**Why do the bars come back as soon as the user taps the screen?**
You are in `'lean-back'` mode, where any tap restores the bars by design. Both `hide()` and `setImmersive('sticky')` keep the bars hidden through taps — with `'sticky'`, the bars only peek in on an edge swipe and hide again on their own.

**Why do the system bars reappear when I open a React Native `Modal`?**
`Modal` opens its own native window on Android, and this library configures the window of your main activity — the modal's window is untouched. Use the `statusBarTranslucent` and `navigationBarTranslucent` props of `Modal` itself, or avoid the native modal in full-screen flows.

## License

[MIT](LICENSE)

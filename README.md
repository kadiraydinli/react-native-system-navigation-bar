# react-native-system-navigation-bar

![npm month downloads](https://badgen.net/npm/dm/react-native-system-navigation-bar)
![npm all time downloads](https://badgen.net/npm/dt/react-native-system-navigation-bar)

React Native lets you customize the navigation bar for Android.

<table>
    <tr>
        <td align="center">
            Hide<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/hide.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Lean Back<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/lean-back.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Immersive <br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/immersive.gif?raw=true" width="200" />
        </td>
    </tr>
    <tr>
        <td align="center">
            Sticky Immersive<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/sticky-immersive.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Low Profile<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/low-profile.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Navigation Color<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/navigation-color.gif?raw=true" width="200" />
        </td>
    </tr>
    <tr>
        <td align="center">
            Navigation Bar Divider Color<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/divider-color.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Bar Mode<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/bar-mode.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Fits System Windows<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/fits-systems-windows.gif?raw=true" width="200" />
        </td>
    </tr>
  </table>

## Installation

```
yarn add react-native-system-navigation-bar
```

## Usage

#### `navigationHide()`

Hides the navigation bar.

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.navigationHide();
```

#### `navigationShow()`

Shows the navigation bar.

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.navigationShow();
```

#### `leanBack()`

For full screen experience where the user will not interact heavily with the screen. You can browse the [documentation](https://developer.android.com/training/system-ui/immersive#leanback 'documentation') for more information.

| Type    | Required | Default |
| ------- | -------- | ------- |
| boolean | No       | true    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.leanBack();
```

#### `immersive()`

The immersive mode is intended for apps in which the user will be heavily interacting with the screen. You can browse the [documentation](https://developer.android.com/training/system-ui/immersive#immersive 'documentation') for more information.

| Type    | Required | Default |
| ------- | -------- | ------- |
| boolean | No       | true    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.immersive();
```

#### `stickyImmersive()`

In the regular immersive mode, any time a user swipes from an edge, the system takes care of revealing the system bars—your app won't even be aware that the gesture occurred. You can browse the [documentation](https://developer.android.com/training/system-ui/immersive#sticky-immersive 'documentation') for more information.

| Type    | Required | Default |
| ------- | -------- | ------- |
| boolean | No       | true    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.stickyImmersive();
```

#### `setBarMode()`

Navigation bar and status changes to bar style.

| Name           | Type                       | Required | Default |
| -------------- | -------------------------- | -------- | ------- |
| Bar Mode Style | light - dark               | No       |         |
| Bar Mode       | status - navigation - both | No       | both    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.setBarMode('light');
SystemNavigationBar.setBarMode('dark', 'navigation');
```

#### `fullScreen()`

Hide or show the navigation bar and the status bar.

| Type    | Required | Default |
| ------- | -------- | ------- |
| boolean | No       | true    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.fullScreen(true);
```

**Note:** For notched devices, add the code below to `/android/app/src/main/res/values/styles.xml` in your project to include the cutout for the notch.

```xml
<item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
```

After adding the code, the estimated content of the `styles.yml` file will be as follows.

```xml
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
    </style>
</resources>
```

Check out the [documentation](https://developer.android.com/develop/ui/views/layout/display-cutout) for more information about this code.

#### `lowProfile()`

The icons in the system and navigation bar are visually retracted. You can browse the [documentation](https://developer.android.com/training/system-ui/dim 'documentation') for more information.

| Type    | Required | Default |
| ------- | -------- | ------- |
| boolean | No       | true    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.lowProfile();
```

#### `setNavigationColor()`

Changes the color of the navigation bar. It also changes the style of the status bar and navigation bar to dark or light.

| Name           | Type                       | Required | Default |
| -------------- | -------------------------- | -------- | ------- |
| Color          | RGB - HSL - Color Ints     | Yes      |         |
| Bar Mode Style | light - dark               | No       |         |
| Bar Mode       | status - navigation - both | No       | both    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.setNavigationColor('red');
SystemNavigationBar.setNavigationColor('translucent');
SystemNavigationBar.setNavigationColor('#FF0000', 'light');
SystemNavigationBar.setNavigationColor(0xff00ff00, 'dark');
SystemNavigationBar.setNavigationColor('blue', 'dark', 'status');
SystemNavigationBar.setNavigationColor('green', 'light', 'navigation');
SystemNavigationBar.setNavigationColor('yellow', 'light', 'both');
SystemNavigationBar.setNavigationColor('hsla(110, 56%, 49%, 0.5)');
```

#### `getBarColor()`

It allows you to access the color of the navigation bar, status bar or both bars as hex color.

| Name | Type                       | Required | Default |
| ---- | -------------------------- | -------- | ------- |
| Bar  | status - navigation - both | No       | both    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

const statusBarColor: string = await SystemNavigationBar.getBarColor('status'); // #757575
const navigationBarColor: string = await SystemNavigationBar.getBarColor(
  'navigation'
); // #FF0000
```

If the `both` option is selected, the colors of both the status bar and the navigation bar will return as Object.

```js
import SystemNavigationBar, {
  GetBarColorType,
} from 'react-native-system-navigation-bar';

const barColors: GetBarColorType = await SystemNavigationBar.getBarColor(
  'both'
);
// { "status": "#757575", "navigation": "#FF0000" }
```

#### `setFitsSystemWindows()`

Boolean internal attribute to adjust view layout based on system windows such as the navigation bar. You can browse the [documentation](https://developer.android.com/reference/android/view/View#attr_android:fitsSystemWindows 'documentation') for more information.

| Type    | Required | Default |
| ------- | -------- | ------- |
| boolean | No       | true    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.setFitsSystemWindows();
SystemNavigationBar.setFitsSystemWindows(false);
```

#### `setNavigationBarDividerColor()`

> Only API Level 28 (Android 9) and higher is supported.

Shows a thin line of the specified color between the navigation bar and the app content. You can browse the [documentation](https://developer.android.com/reference/android/view/Window#attr_android:navigationBarDividerColor 'documentation') for more information.

| Name  | Type                   | Required |
| ----- | ---------------------- | -------- |
| Color | RGB - HSL - Color Ints | Yes      |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.setNavigationBarDividerColor('red');
SystemNavigationBar.setNavigationBarDividerColor('#FF0000');
SystemNavigationBar.setNavigationBarDividerColor(0xff00ff00);
SystemNavigationBar.setNavigationBarDividerColor('hsla(110, 56%, 49%, 0.5)');
```

#### `setNavigationBarContrastEnforced()`

> Only API Level 29 (Android 10) and higher is supported.

Sets whether the system should ensure that the navigation bar has enough contrast when a fully transparent background is requested. You can browse the [documentation](<https://developer.android.com/reference/android/view/Window#setNavigationBarContrastEnforced(boolean)> 'documentation') for more information.

| Type    | Required | Default |
| ------- | -------- | ------- |
| boolean | No       | true    |

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.setNavigationBarContrastEnforced(true);
```

### And

All functions have callbacks.

#### Usage

```js
import SystemNavigationBar from 'react-native-system-navigation-bar';

const show = async () => {
  const result = await SystemNavigationBar.navigationShow();

  console.log('Show: ', result); // true or Error Message
};
```

## License

MIT

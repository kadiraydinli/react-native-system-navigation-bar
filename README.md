# react-native-system-navigation-bar

React Native lets you customize the navigation bar for Android.

<table>
    <tr>
        <td align="center">
            Hide<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/hide.png?raw=true" width="200" />
        </td>
        <td align="center">
            Lean Back<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/leanBack.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Immersive <br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/immersive.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Sticky Immersive<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/stickyImmersive.gif?raw=true" width="200" />
        </td>
    </tr>
    <tr>
        <td align="center">
            Low Profile<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/lowProfile.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Navigation Color<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/navigationColor.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Navigation Bar Divider Color<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/navigationBarDividerColor.gif?raw=true" width="200" />
        </td>
        <td align="center">
            Light Navigation Bar<br />
            <img src="https://github.com/kadiraydinli/react-native-system-navigation-bar/blob/master/screenshots/lightNavigationBar.gif?raw=true" width="200" />
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
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.navigationHide()
```

#### `navigationShow()`

Shows the navigation bar.
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.navigationShow()
```

#### `leanBack()`

For full screen experience where the user will not interact heavily with the screen. You can browse the [documentation](https://developer.android.com/training/system-ui/immersive#leanback "documentation") for more information.
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.leanBack()
```

#### `immersive()`

The immersive mode is intended for apps in which the user will be heavily interacting with the screen. You can browse the [documentation](https://developer.android.com/training/system-ui/immersive#immersive "documentation") for more information.
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.immersive()
```

#### `stickyImmersive()`

In the regular immersive mode, any time a user swipes from an edge, the system takes care of revealing the system bars—your app won't even be aware that the gesture occurred. You can browse the [documentation](https://developer.android.com/training/system-ui/immersive#sticky-immersive "documentation") for more information.
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.stickyImmersive()
```

#### `lightNavigationBar()`

Navigation bar and status changes to bar style.

| Type  | Reqired | Default |
| ------------- | ------------- | ------------- |
| boolean  | No | false |
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.lightNavigationBar(true)
```

#### `fullScreen()`

Hide or show the navigation bar and the status bar.

| Type  | Reqired | Default |
| ------------- | ------------- | ------------- |
| boolean  | No | false |
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.fullScreen(true)
```

#### `lowProfile()`

The icons in the system and navigation bar are visually retracted. You can browse the [documentation](https://developer.android.com/training/system-ui/dim "documentation") for more information.
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.lowProfile()
```

#### `setNavigationColor()`

Changes the color of the navigation bar. It also changes the style of the status bar and navigation bar to dark or light.

|Name | Type  | Reqired | Default |
| ------------- | ------------- | ------------- | ------------- |
| Color | RGB - HSL - Color Ints  | Yes | |
| Light Bar | boolean  | No | false |
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.setNavigationColor("red")
SystemNavigationBar.setNavigationColor("#FF0000", true)
SystemNavigationBar.setNavigationColor(0xff00ff00, false)
SystemNavigationBar.setNavigationColor("hsla(110, 56%, 49%, 0.5)")
```

#### `setNavigationBarDividerColor()`

> Only API Level 28 (Android 9) and higher is supported.

Shows a thin line of the specified color between the navigation bar and the app content. You can browse the [documentation](https://developer.android.com/reference/android/view/Window#attr_android:navigationBarDividerColor "documentation") for more information.

|Name | Type  | Reqired |
| ------------- | ------------- | ------------- |
| Color | RGB - HSL - Color Ints | Yes |
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.setNavigationBarDividerColor("red")
SystemNavigationBar.setNavigationBarDividerColor("#FF0000")
SystemNavigationBar.setNavigationBarDividerColor(0xff00ff00)
SystemNavigationBar.setNavigationBarDividerColor("hsla(110, 56%, 49%, 0.5)")
```

#### `setNavigationBarContrastEnforced()`

> Only API Level 29 (Android 10) and higher is supported.

Sets whether the system should ensure that the navigation bar has enough contrast when a fully transparent background is requested. You can browse the [documentation](https://developer.android.com/reference/android/view/Window#setNavigationBarContrastEnforced(boolean) "documentation") for more information.

| Type  | Reqired | Default |
| ------------- | ------------- | ------------- |
| boolean  | No | false |
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

SystemNavigationBar.setNavigationBarContrastEnforced(true)
```

### And
All functions have callbacks.
#### Usage
```js
import SystemNavigationBar from "react-native-system-navigation-bar";

const show = async () => {
  const result = await SystemNavigationBar.navigationShow()

  console.log("Show: ", result) //true or Error Message
}
```

## License

MIT

import { NativeModules, Platform, processColor } from 'react-native';

const { NavigationBar } = NativeModules;

const navigationHide = async () => {
  if (Platform.OS === 'android') {
    return await NavigationBar.navigationHide();
  }
};

const navigationShow = async () => {
  if (Platform.OS === 'android') {
    return await NavigationBar.navigationShow();
  }
};

const leanBack = async () => {
  if (Platform.OS === 'android') {
    return await NavigationBar.leanBack();
  }
};

const immersive = async () => {
  if (Platform.OS === 'android') {
    return await NavigationBar.immersive();
  }
};

const stickyImmersive = async () => {
  if (Platform.OS === 'android') {
    return await NavigationBar.stickyImmersive();
  }
};

const lowProfile = async () => {
  if (Platform.OS === 'android') {
    return await NavigationBar.lowProfile();
  }
};

const getBarModeTypes = (
  style?: 'light' | 'dark',
  bar?: 'navigation' | 'status' | 'both'
) => {
  const modeStyle =
    style === 'light'
      ? NavigationBar.LIGHT
      : style === 'dark'
      ? NavigationBar.DARK
      : NavigationBar.NO_MODE;

  const mode =
    bar === 'navigation'
      ? NavigationBar.NAVIGATION_BAR
      : bar === 'status'
      ? NavigationBar.STATUS_BAR
      : NavigationBar.NAVIGATION_BAR_STATUS_BAR;

  return {
    modeStyle,
    mode,
  };
};

const setBarMode = async (
  style?: 'light' | 'dark',
  bar?: 'navigation' | 'status' | 'both'
) => {
  if (Platform.OS === 'android') {
    const { modeStyle, mode } = getBarModeTypes(style, bar);
    return await NavigationBar.setBarMode(modeStyle, mode);
  }
};

const setNavigationColor = async (
  color: string | number,
  style?: 'light' | 'dark',
  bar?: 'navigation' | 'status' | 'both'
) => {
  if (Platform.OS === 'android') {
    const { modeStyle, mode } = getBarModeTypes(style, bar);
    return await NavigationBar.setNavigationColor(
      color === 'translucent' ? 0 : processColor(color),
      color === 'translucent',
      modeStyle,
      mode
    );
  }
};

const setNavigationBarDividerColor = async (color: string | number) => {
  if (Platform.OS === 'android') {
    return await NavigationBar.setNavigationBarDividerColor(
      processColor(color)
    );
  }
};

const setNavigationBarContrastEnforced = async (enforceContrast?: boolean) => {
  if (Platform.OS === 'android') {
    return await NavigationBar.setNavigationBarContrastEnforced(
      enforceContrast || false
    );
  }
};

const fullScreen = async (enable?: boolean) => {
  if (Platform.OS === 'android') {
    return await NavigationBar.fullScreen(enable || false);
  }
};

var SystemNavigationBar = {
  navigationHide,
  navigationShow,
  leanBack,
  immersive,
  stickyImmersive,
  lowProfile,
  setBarMode,
  setNavigationColor,
  setNavigationBarDividerColor,
  setNavigationBarContrastEnforced,
  fullScreen,
};

export default SystemNavigationBar;

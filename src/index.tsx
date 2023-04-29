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

const leanBack = async (enabled?: boolean) => {
  if (Platform.OS === 'android') {
    const state = typeof enabled === 'boolean' ? enabled : true;
    return await NavigationBar.leanBack(state);
  }
};

const immersive = async () => {
  if (Platform.OS === 'android') {
    return await NavigationBar.immersive();
  }
};

const stickyImmersive = async (enabled?: boolean) => {
  if (Platform.OS === 'android') {
    const state = typeof enabled === 'boolean' ? enabled : true;
    return await NavigationBar.stickyImmersive(state);
  }
};

const lowProfile = async (enabled?: boolean) => {
  if (Platform.OS === 'android') {
    const state = typeof enabled === 'boolean' ? enabled : true;
    return await NavigationBar.lowProfile(state);
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

const setNavigationBarContrastEnforced = async (enabled?: boolean) => {
  if (Platform.OS === 'android') {
    const state = typeof enabled === 'boolean' ? enabled : true;
    return await NavigationBar.setNavigationBarContrastEnforced(state);
  }
};

const fullScreen = async (enabled?: boolean) => {
  if (Platform.OS === 'android') {
    const state = typeof enabled === 'boolean' ? enabled : true;
    return await NavigationBar.fullScreen(state);
  }
};

export type GetBarColorType = string | { status: string; navigation: string };

const getBarColor = async (
  bar?: 'navigation' | 'status' | 'both'
): Promise<GetBarColorType> => {
  if (Platform.OS === 'android') {
    const { mode } = getBarModeTypes('light', bar || 'both');
    const result = await NavigationBar.getBarColor(mode);

    if (mode === NavigationBar.NAVIGATION_BAR_STATUS_BAR) {
      return JSON.parse(result);
    } else {
      return result;
    }
  }
  return '';
};

const setFitsSystemWindows = async (enabled?: boolean) => {
  if (Platform.OS === 'android') {
    const state = typeof enabled === 'boolean' ? enabled : true;
    return await NavigationBar.setFitsSystemWindows(state);
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
  getBarColor,
  setFitsSystemWindows,
};

export default SystemNavigationBar;

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

const lightNavigationBar = async (light?: boolean) => {
  if (Platform.OS === 'android') {
    return await NavigationBar.lightNavigationBar(light || false);
  }
};

const setNavigationColor = async (color: string | number, light?: boolean) => {
  if (Platform.OS === 'android') {
    return await NavigationBar.setNavigationColor(
      processColor(color),
      color === 'translucent',
      light || false
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
  lightNavigationBar,
  setNavigationColor,
  setNavigationBarDividerColor,
  setNavigationBarContrastEnforced,
  fullScreen,
};

export default SystemNavigationBar;

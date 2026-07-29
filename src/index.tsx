import { processColor, type ColorValue } from 'react-native';
import NativeSystemNavigationBar, {
  type BarColors,
} from './NativeSystemNavigationBar';

export type SystemBar = 'navigation' | 'status' | 'both';
export type BarStyle = 'light' | 'dark';
export type ImmersiveMode = 'lean-back' | 'immersive' | 'sticky';
export type NavigationMode = 'gesture' | 'two-button' | 'three-button';

/**
 * Any color React Native can process: a string form such as `'red'`,
 * `'#FF0000'` or `'rgba(…)'`, or a number read as `0xRRGGBBAA`.
 */
export type ColorInput = ColorValue | number;

export type SetBarColorOptions = {
  bar?: SystemBar;
  translucent?: boolean;
  style?: BarStyle;
};

export type { BarColors };

// Reported when no native module is available: the bars have no color to
// read, and the value still round-trips through setBarColor.
const NO_BAR_COLORS: BarColors = {
  status: '#00000000',
  navigation: '#00000000',
};

/**
 * The native module is absent on platforms this library does not implement, and
 * on native platforms where the app has not been rebuilt since installing it.
 * Every method falls back to a resolved no-op in that case.
 */
const native = NativeSystemNavigationBar;

const warned = new Set<string>();

const warnOnce = (key: string, message: string): void => {
  if (__DEV__ && !warned.has(key)) {
    warned.add(key);
    console.warn(message);
  }
};

const warnDeprecated = (alias: string, replacement: string): void => {
  warnOnce(
    alias,
    `SystemNavigationBar.${alias}() is deprecated and will be removed in v4, use ${replacement} instead.`
  );
};

/**
 * Coerces the argument of a boolean parameter the way v2 did: anything that is
 * not a boolean falls back to the default instead of reaching the native
 * boundary, which would throw synchronously on a type mismatch.
 */
const asBoolean = (value: unknown, fallback = true): boolean =>
  typeof value === 'boolean' ? value : fallback;

/**
 * Resolves a React Native color to the integer the native modules expect.
 * `processColor` returns undefined for unparsable values and an opaque object
 * for platform colors, neither of which can cross the bridge as a number.
 */
const toColorInt = (color: ColorInput, method: string): number => {
  const processed = processColor(color);
  if (typeof processed !== 'number') {
    throw new Error(
      `SystemNavigationBar.${method}(): unsupported color value. Pass a color string, an integer, or an rgba()/hsla() value — PlatformColor and DynamicColorIOS are not supported.`
    );
  }
  return processed;
};

const hide = (bar: SystemBar = 'navigation'): Promise<void> =>
  native?.hide(bar) ?? Promise.resolve();

const show = (bar: SystemBar = 'navigation'): Promise<void> =>
  native?.show(bar) ?? Promise.resolve();

const setImmersive = (
  mode: ImmersiveMode,
  enabled: boolean = true
): Promise<void> =>
  native?.setImmersive(mode, asBoolean(enabled)) ?? Promise.resolve();

const setBarStyle = (style: BarStyle, bar: SystemBar = 'both'): Promise<void> =>
  native?.setBarStyle(style, bar) ?? Promise.resolve();

const setBarColor = async (
  color: ColorInput,
  options?: SetBarColorOptions
): Promise<void> => {
  const colorInt = toColorInt(color, 'setBarColor');
  await native?.setBarColor(
    colorInt,
    options?.translucent ?? false,
    options?.style ?? 'none',
    options?.bar ?? 'both'
  );
};

const getBarColor = (bar?: SystemBar): Promise<BarColors> => {
  if (bar !== undefined) {
    warnOnce(
      'getBarColor.bar',
      'SystemNavigationBar.getBarColor() no longer takes a bar argument and always resolves { status, navigation }. The argument is ignored and will be rejected in v4.'
    );
  }
  return native?.getBarColor() ?? Promise.resolve(NO_BAR_COLORS);
};

const setDividerColor = async (color: ColorInput): Promise<void> => {
  const colorInt = toColorInt(color, 'setDividerColor');
  await native?.setDividerColor(colorInt);
};

const setContrastEnforced = (enabled: boolean = true): Promise<void> =>
  native?.setContrastEnforced(asBoolean(enabled)) ?? Promise.resolve();

const setEdgeToEdge = (enabled: boolean = true): Promise<void> =>
  native?.setEdgeToEdge(asBoolean(enabled)) ?? Promise.resolve();

const isEdgeToEdgeEnabled = (): Promise<boolean> =>
  native?.isEdgeToEdgeEnabled() ?? Promise.resolve(false);

const getNavigationMode = async (): Promise<NavigationMode> => {
  if (native == null) {
    return 'gesture';
  }
  return (await native.getNavigationMode()) as NavigationMode;
};

const setHomeIndicatorAutoHidden = (enabled: boolean = true): Promise<void> =>
  native?.setHomeIndicatorAutoHidden(asBoolean(enabled)) ?? Promise.resolve();

const setSystemGesturesDeferred = (enabled: boolean = true): Promise<void> =>
  native?.setSystemGesturesDeferred(asBoolean(enabled)) ?? Promise.resolve();

/** @deprecated Use `hide('navigation')` instead. Will be removed in v4. */
const navigationHide = (): Promise<void> => {
  warnDeprecated('navigationHide', 'hide()');
  return hide('navigation');
};

/** @deprecated Use `show('navigation')` instead. Will be removed in v4. */
const navigationShow = (): Promise<void> => {
  warnDeprecated('navigationShow', 'show()');
  return show('navigation');
};

/** @deprecated Use `setImmersive('lean-back')` instead. Will be removed in v4. */
const leanBack = (enabled: boolean = true): Promise<void> => {
  warnDeprecated('leanBack', "setImmersive('lean-back')");
  return setImmersive('lean-back', asBoolean(enabled));
};

/** @deprecated Use `setImmersive('immersive')` instead. Will be removed in v4. */
const immersive = (): Promise<void> => {
  warnDeprecated('immersive', "setImmersive('immersive')");
  return setImmersive('immersive', true);
};

/** @deprecated Use `setImmersive('sticky')` instead. Will be removed in v4. */
const stickyImmersive = (enabled: boolean = true): Promise<void> => {
  warnDeprecated('stickyImmersive', "setImmersive('sticky')");
  return setImmersive('sticky', asBoolean(enabled));
};

/** @deprecated Use `hide('both')` / `show('both')` instead. Will be removed in v4. */
const fullScreen = (enabled: boolean = true): Promise<void> => {
  warnDeprecated('fullScreen', "hide('both') / show('both')");
  return asBoolean(enabled) ? hide('both') : show('both');
};

/** @deprecated Use `setBarStyle()` instead. Will be removed in v4. */
const setBarMode = (
  style?: BarStyle,
  bar: SystemBar = 'both'
): Promise<void> => {
  warnDeprecated('setBarMode', 'setBarStyle()');
  // v2 applied dark icons when no style was given.
  return setBarStyle(style ?? 'dark', bar);
};

/** @deprecated Use `setBarColor()` instead. Will be removed in v4. */
const setNavigationColor = (
  color: ColorInput,
  style?: BarStyle,
  bar?: SystemBar
): Promise<void> => {
  warnDeprecated('setNavigationColor', 'setBarColor()');
  // v2 always colored the navigation bar only; the bar argument only chose
  // which bars the icon style applied to (defaulting to both).
  const translucent = color === 'translucent';
  const colored = setBarColor(translucent ? 'transparent' : color, {
    bar: 'navigation',
    translucent,
  });
  return style
    ? colored.then(() => setBarStyle(style, bar ?? 'both'))
    : colored;
};

/** @deprecated Use `setDividerColor()` instead. Will be removed in v4. */
const setNavigationBarDividerColor = (color: ColorInput): Promise<void> => {
  warnDeprecated('setNavigationBarDividerColor', 'setDividerColor()');
  return setDividerColor(color);
};

/** @deprecated Use `setContrastEnforced()` instead. Will be removed in v4. */
const setNavigationBarContrastEnforced = (
  enabled: boolean = true
): Promise<void> => {
  warnDeprecated('setNavigationBarContrastEnforced', 'setContrastEnforced()');
  return setContrastEnforced(asBoolean(enabled));
};

/** @deprecated Use `setEdgeToEdge()` instead (note the inverted flag). Will be removed in v4. */
const setFitsSystemWindows = (enabled: boolean = true): Promise<void> => {
  warnDeprecated('setFitsSystemWindows', 'setEdgeToEdge()');
  return setEdgeToEdge(!asBoolean(enabled));
};

const SystemNavigationBar = {
  hide,
  show,
  setImmersive,
  setBarStyle,
  setBarColor,
  getBarColor,
  setDividerColor,
  setContrastEnforced,
  setEdgeToEdge,
  isEdgeToEdgeEnabled,
  getNavigationMode,
  // iOS-only.
  setHomeIndicatorAutoHidden,
  setSystemGesturesDeferred,
  // Deprecated v2 aliases, removed in v4.
  navigationHide,
  navigationShow,
  leanBack,
  immersive,
  stickyImmersive,
  fullScreen,
  setBarMode,
  setNavigationColor,
  setNavigationBarDividerColor,
  setNavigationBarContrastEnforced,
  setFitsSystemWindows,
};

export default SystemNavigationBar;

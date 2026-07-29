import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { processColor } from 'react-native';
import SystemNavigationBar from '../index';
import NativeSystemNavigationBar from '../NativeSystemNavigationBar';

jest.mock('../NativeSystemNavigationBar', () => ({
  __esModule: true,
  default: {
    hide: jest.fn(() => Promise.resolve()),
    show: jest.fn(() => Promise.resolve()),
    setImmersive: jest.fn(() => Promise.resolve()),
    setBarStyle: jest.fn(() => Promise.resolve()),
    setBarColor: jest.fn(() => Promise.resolve()),
    getBarColor: jest.fn(() =>
      Promise.resolve({ status: '#ff0000', navigation: '#00ff00' })
    ),
    setDividerColor: jest.fn(() => Promise.resolve()),
    setContrastEnforced: jest.fn(() => Promise.resolve()),
    setEdgeToEdge: jest.fn(() => Promise.resolve()),
    isEdgeToEdgeEnabled: jest.fn(() => Promise.resolve(true)),
    getNavigationMode: jest.fn(() => Promise.resolve('three-button')),
    setHomeIndicatorAutoHidden: jest.fn(() => Promise.resolve()),
    setSystemGesturesDeferred: jest.fn(() => Promise.resolve()),
  },
}));

// The mock always provides the module; the real type allows null on
// platforms where the native module is absent.
const mockNative = jest.mocked(NativeSystemNavigationBar!);

// Metro/Jest provide `require` at runtime; declared here so TypeScript does
// not depend on Node globals. Used to load fresh module copies for the
// one-time deprecation warning tests.
declare const require: (moduleId: string) => unknown;

const requireFreshModule = (): typeof SystemNavigationBar =>
  (require('../index') as { default: typeof SystemNavigationBar }).default;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('SystemNavigationBar', () => {
  it('hides the navigation bar by default', async () => {
    await SystemNavigationBar.hide();
    expect(mockNative.hide).toHaveBeenCalledWith('navigation');
  });

  it('hides the requested bar', async () => {
    await SystemNavigationBar.hide('both');
    expect(mockNative.hide).toHaveBeenCalledWith('both');
  });

  it('shows the navigation bar by default', async () => {
    await SystemNavigationBar.show();
    expect(mockNative.show).toHaveBeenCalledWith('navigation');
  });

  it('shows the requested bar', async () => {
    await SystemNavigationBar.show('status');
    expect(mockNative.show).toHaveBeenCalledWith('status');
  });

  it('enables immersive mode by default', async () => {
    await SystemNavigationBar.setImmersive('sticky');
    expect(mockNative.setImmersive).toHaveBeenCalledWith('sticky', true);
  });

  it('disables immersive mode when requested', async () => {
    await SystemNavigationBar.setImmersive('lean-back', false);
    expect(mockNative.setImmersive).toHaveBeenCalledWith('lean-back', false);
  });

  it('sets the bar style on both bars by default', async () => {
    await SystemNavigationBar.setBarStyle('dark');
    expect(mockNative.setBarStyle).toHaveBeenCalledWith('dark', 'both');
  });

  it('sets the bar style on the requested bar', async () => {
    await SystemNavigationBar.setBarStyle('light', 'status');
    expect(mockNative.setBarStyle).toHaveBeenCalledWith('light', 'status');
  });

  it('sets the bar color on both bars by default', async () => {
    await SystemNavigationBar.setBarColor('red');
    expect(mockNative.setBarColor).toHaveBeenCalledWith(
      processColor('red'),
      false,
      'none',
      'both'
    );
  });

  it('accepts numeric colors', async () => {
    await SystemNavigationBar.setBarColor(0xff0000ff);
    expect(mockNative.setBarColor).toHaveBeenCalledWith(
      processColor(0xff0000ff),
      false,
      'none',
      'both'
    );
  });

  it('coerces non-boolean flags the way v2 did', async () => {
    // @ts-expect-error untyped callers reach this path
    await SystemNavigationBar.setEdgeToEdge(null);
    expect(mockNative.setEdgeToEdge).toHaveBeenCalledWith(true);

    // @ts-expect-error untyped callers reach this path
    await SystemNavigationBar.setContrastEnforced('yes');
    expect(mockNative.setContrastEnforced).toHaveBeenCalledWith(true);
  });

  it('rejects color values that cannot cross the bridge', async () => {
    await expect(
      SystemNavigationBar.setBarColor('not-a-color')
    ).rejects.toThrow('unsupported color value');
    await expect(
      SystemNavigationBar.setDividerColor('#GGGGGG')
    ).rejects.toThrow('unsupported color value');
    expect(mockNative.setBarColor).not.toHaveBeenCalled();
    expect(mockNative.setDividerColor).not.toHaveBeenCalled();
  });

  it('sets the bar color with the given options', async () => {
    await SystemNavigationBar.setBarColor('#123456', {
      bar: 'both',
      translucent: true,
      style: 'light',
    });
    expect(mockNative.setBarColor).toHaveBeenCalledWith(
      processColor('#123456'),
      true,
      'light',
      'both'
    );
  });

  it('returns the bar colors from the native module', async () => {
    await expect(SystemNavigationBar.getBarColor()).resolves.toEqual({
      status: '#ff0000',
      navigation: '#00ff00',
    });
  });

  it('warns when getBarColor is called with the removed bar argument', async () => {
    await expect(SystemNavigationBar.getBarColor('status')).resolves.toEqual({
      status: '#ff0000',
      navigation: '#00ff00',
    });
    expect(console.warn).toHaveBeenCalledWith(
      'SystemNavigationBar.getBarColor() no longer takes a bar argument and always resolves { status, navigation }. The argument is ignored and will be rejected in v4.'
    );
  });

  it('sets the divider color as a processed color', async () => {
    await SystemNavigationBar.setDividerColor('blue');
    expect(mockNative.setDividerColor).toHaveBeenCalledWith(
      processColor('blue')
    );
  });

  it('enforces contrast by default', async () => {
    await SystemNavigationBar.setContrastEnforced();
    expect(mockNative.setContrastEnforced).toHaveBeenCalledWith(true);
  });

  it('disables contrast enforcement when requested', async () => {
    await SystemNavigationBar.setContrastEnforced(false);
    expect(mockNative.setContrastEnforced).toHaveBeenCalledWith(false);
  });

  it('enables edge-to-edge by default', async () => {
    await SystemNavigationBar.setEdgeToEdge();
    expect(mockNative.setEdgeToEdge).toHaveBeenCalledWith(true);
  });

  it('reports the edge-to-edge state', async () => {
    await expect(SystemNavigationBar.isEdgeToEdgeEnabled()).resolves.toBe(true);
  });

  it('reports the navigation mode', async () => {
    await expect(SystemNavigationBar.getNavigationMode()).resolves.toBe(
      'three-button'
    );
  });

  it('setHomeIndicatorAutoHidden defaults to true', async () => {
    await SystemNavigationBar.setHomeIndicatorAutoHidden();
    expect(mockNative.setHomeIndicatorAutoHidden).toHaveBeenCalledWith(true);

    await SystemNavigationBar.setHomeIndicatorAutoHidden(false);
    expect(mockNative.setHomeIndicatorAutoHidden).toHaveBeenCalledWith(false);
  });

  it('setSystemGesturesDeferred defaults to true', async () => {
    await SystemNavigationBar.setSystemGesturesDeferred();
    expect(mockNative.setSystemGesturesDeferred).toHaveBeenCalledWith(true);

    await SystemNavigationBar.setSystemGesturesDeferred(false);
    expect(mockNative.setSystemGesturesDeferred).toHaveBeenCalledWith(false);
  });
});

describe('deprecated aliases', () => {
  it('navigationHide hides the navigation bar', async () => {
    await SystemNavigationBar.navigationHide();
    expect(mockNative.hide).toHaveBeenCalledWith('navigation');
  });

  it('navigationShow shows the navigation bar', async () => {
    await SystemNavigationBar.navigationShow();
    expect(mockNative.show).toHaveBeenCalledWith('navigation');
  });

  it('leanBack toggles lean-back immersive mode', async () => {
    await SystemNavigationBar.leanBack();
    expect(mockNative.setImmersive).toHaveBeenCalledWith('lean-back', true);

    await SystemNavigationBar.leanBack(false);
    expect(mockNative.setImmersive).toHaveBeenCalledWith('lean-back', false);
  });

  it('immersive enables immersive mode', async () => {
    await SystemNavigationBar.immersive();
    expect(mockNative.setImmersive).toHaveBeenCalledWith('immersive', true);
  });

  it('stickyImmersive toggles sticky immersive mode', async () => {
    await SystemNavigationBar.stickyImmersive();
    expect(mockNative.setImmersive).toHaveBeenCalledWith('sticky', true);

    await SystemNavigationBar.stickyImmersive(false);
    expect(mockNative.setImmersive).toHaveBeenCalledWith('sticky', false);
  });

  it('fullScreen hides both bars when enabled', async () => {
    await SystemNavigationBar.fullScreen();
    expect(mockNative.hide).toHaveBeenCalledWith('both');
    expect(mockNative.show).not.toHaveBeenCalled();
  });

  it('fullScreen shows both bars when disabled', async () => {
    await SystemNavigationBar.fullScreen(false);
    expect(mockNative.show).toHaveBeenCalledWith('both');
    expect(mockNative.hide).not.toHaveBeenCalled();
  });

  it('setBarMode applies dark icons to both bars by default, as v2 did', async () => {
    await SystemNavigationBar.setBarMode();
    expect(mockNative.setBarStyle).toHaveBeenCalledWith('dark', 'both');
  });

  it('setBarMode forwards style and bar', async () => {
    await SystemNavigationBar.setBarMode('dark', 'status');
    expect(mockNative.setBarStyle).toHaveBeenCalledWith('dark', 'status');
  });

  it('setNavigationColor sets the navigation bar color by default', async () => {
    await SystemNavigationBar.setNavigationColor('red');
    expect(mockNative.setBarColor).toHaveBeenCalledWith(
      processColor('red'),
      false,
      'none',
      'navigation'
    );
  });

  it('setNavigationColor colors the navigation bar and styles the given bars', async () => {
    await SystemNavigationBar.setNavigationColor('red', 'dark', 'status');
    expect(mockNative.setBarColor).toHaveBeenCalledWith(
      processColor('red'),
      false,
      'none',
      'navigation'
    );
    expect(mockNative.setBarStyle).toHaveBeenCalledWith('dark', 'status');
  });

  it('setNavigationColor defaults the style target to both bars, as v2 did', async () => {
    await SystemNavigationBar.setNavigationColor('red', 'light');
    expect(mockNative.setBarColor).toHaveBeenCalledWith(
      processColor('red'),
      false,
      'none',
      'navigation'
    );
    expect(mockNative.setBarStyle).toHaveBeenCalledWith('light', 'both');
  });

  it("setNavigationColor maps 'translucent' to a transparent translucent bar", async () => {
    await SystemNavigationBar.setNavigationColor('translucent');
    expect(mockNative.setBarColor).toHaveBeenCalledWith(
      processColor('transparent'),
      true,
      'none',
      'navigation'
    );
  });

  it('setNavigationBarDividerColor sets the divider color', async () => {
    await SystemNavigationBar.setNavigationBarDividerColor('red');
    expect(mockNative.setDividerColor).toHaveBeenCalledWith(
      processColor('red')
    );
  });

  it('setNavigationBarContrastEnforced enforces contrast', async () => {
    await SystemNavigationBar.setNavigationBarContrastEnforced();
    expect(mockNative.setContrastEnforced).toHaveBeenCalledWith(true);
  });

  it('fullScreen coerces a non-boolean argument to true, as v2 did', async () => {
    // @ts-expect-error untyped callers reach this path
    await SystemNavigationBar.fullScreen(null);
    expect(mockNative.hide).toHaveBeenCalledWith('both');
  });

  it('setFitsSystemWindows inverts the edge-to-edge flag', async () => {
    await SystemNavigationBar.setFitsSystemWindows();
    expect(mockNative.setEdgeToEdge).toHaveBeenCalledWith(false);

    await SystemNavigationBar.setFitsSystemWindows(false);
    expect(mockNative.setEdgeToEdge).toHaveBeenCalledWith(true);
  });
});

describe('deprecation warnings', () => {
  it('warns once per alias', async () => {
    let fresh: typeof SystemNavigationBar;
    jest.isolateModules(() => {
      fresh = requireFreshModule();
    });

    await fresh!.navigationHide();
    await fresh!.navigationHide();
    await fresh!.navigationShow();

    expect(console.warn).toHaveBeenCalledTimes(2);
    expect(console.warn).toHaveBeenNthCalledWith(
      1,
      'SystemNavigationBar.navigationHide() is deprecated and will be removed in v4, use hide() instead.'
    );
    expect(console.warn).toHaveBeenNthCalledWith(
      2,
      'SystemNavigationBar.navigationShow() is deprecated and will be removed in v4, use show() instead.'
    );
  });

  it('does not warn for the new API', async () => {
    let fresh: typeof SystemNavigationBar;
    jest.isolateModules(() => {
      fresh = requireFreshModule();
    });

    await fresh!.hide();
    await fresh!.setBarColor('red');
    await fresh!.setEdgeToEdge();

    expect(console.warn).not.toHaveBeenCalled();
  });
});

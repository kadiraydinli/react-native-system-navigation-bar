import { describe, expect, it, jest } from '@jest/globals';
import SystemNavigationBar from '../index';

// Mirrors a platform where the native module is not registered — for example an
// app that installed the package but has not been rebuilt yet.
jest.mock('../NativeSystemNavigationBar', () => ({
  __esModule: true,
  default: null,
}));

describe('without a native module', () => {
  it('resolves every setter instead of throwing', async () => {
    await expect(SystemNavigationBar.hide()).resolves.toBeUndefined();
    await expect(SystemNavigationBar.show('both')).resolves.toBeUndefined();
    await expect(
      SystemNavigationBar.setImmersive('sticky')
    ).resolves.toBeUndefined();
    await expect(
      SystemNavigationBar.setBarStyle('dark')
    ).resolves.toBeUndefined();
    await expect(
      SystemNavigationBar.setBarColor('red')
    ).resolves.toBeUndefined();
    await expect(
      SystemNavigationBar.setDividerColor('red')
    ).resolves.toBeUndefined();
    await expect(
      SystemNavigationBar.setContrastEnforced()
    ).resolves.toBeUndefined();
    await expect(SystemNavigationBar.setEdgeToEdge()).resolves.toBeUndefined();
    await expect(
      SystemNavigationBar.setHomeIndicatorAutoHidden()
    ).resolves.toBeUndefined();
    await expect(
      SystemNavigationBar.setSystemGesturesDeferred()
    ).resolves.toBeUndefined();
  });

  it('resolves getters with neutral defaults that round-trip', async () => {
    const colors = await SystemNavigationBar.getBarColor();
    expect(colors).toEqual({
      status: '#00000000',
      navigation: '#00000000',
    });
    await expect(
      SystemNavigationBar.setBarColor(colors.navigation)
    ).resolves.toBeUndefined();

    await expect(SystemNavigationBar.isEdgeToEdgeEnabled()).resolves.toBe(
      false
    );
    await expect(SystemNavigationBar.getNavigationMode()).resolves.toBe(
      'gesture'
    );
  });
});

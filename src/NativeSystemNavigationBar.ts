import { TurboModuleRegistry, type TurboModule } from 'react-native';

export type BarColors = {
  status: string;
  navigation: string;
};

export interface Spec extends TurboModule {
  hide(bar: string): Promise<void>;
  show(bar: string): Promise<void>;
  setImmersive(mode: string, enabled: boolean): Promise<void>;
  setBarStyle(style: string, bar: string): Promise<void>;
  setBarColor(
    color: number,
    translucent: boolean,
    style: string,
    bar: string
  ): Promise<void>;
  getBarColor(): Promise<BarColors>;
  setDividerColor(color: number): Promise<void>;
  setContrastEnforced(enabled: boolean): Promise<void>;
  setEdgeToEdge(enabled: boolean): Promise<void>;
  isEdgeToEdgeEnabled(): Promise<boolean>;
  getNavigationMode(): Promise<string>;
  setHomeIndicatorAutoHidden(enabled: boolean): Promise<void>;
  setSystemGesturesDeferred(enabled: boolean): Promise<void>;
}

// `get` rather than `getEnforcing`: a missing native module resolves to null so
// the JS layer can fall back to no-ops instead of throwing at import time.
export default TurboModuleRegistry.get<Spec>('SystemNavigationBar');

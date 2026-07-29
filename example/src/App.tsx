import { useCallback, useState, type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

type BarTarget = 'navigation' | 'status' | 'both';
type ImmersiveMode = 'lean-back' | 'immersive' | 'sticky';
type BarStyle = 'light' | 'dark';

const BAR_TARGETS: BarTarget[] = ['navigation', 'status', 'both'];
const IMMERSIVE_MODES: ImmersiveMode[] = ['lean-back', 'immersive', 'sticky'];

const COLOR_PRESETS = [
  { label: 'Slate', value: '#0F172A' },
  { label: 'Indigo', value: '#4F46E5' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Crimson', value: '#DC2626' },
  { label: 'White', value: '#FFFFFF' },
];

const DIVIDER_PRESETS = [
  { label: 'Gray', value: '#9CA3AF' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Blue', value: '#3B82F6' },
];

type Status = {
  statusColor: string;
  navigationColor: string;
  edgeToEdge: string;
  navigationMode: string;
};

export default function App() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const [barTarget, setBarTarget] = useState<BarTarget>('navigation');
  const [immersiveMode, setImmersiveMode] = useState<ImmersiveMode | null>(
    null
  );
  const [barStyle, setBarStyle] = useState<BarStyle>(isDark ? 'light' : 'dark');
  const [translucent, setTranslucent] = useState(false);
  const [contrastEnforced, setContrastEnforced] = useState(true);
  const [edgeToEdge, setEdgeToEdge] = useState(false);
  const [indicatorHidden, setIndicatorHidden] = useState(false);
  const [gesturesDeferred, setGesturesDeferred] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const run = useCallback(async (action: () => Promise<unknown>) => {
    try {
      setLastError(null);
      await action();
    } catch (error) {
      setLastError(error instanceof Error ? error.message : String(error));
    }
  }, []);

  const onToggleImmersive = (mode: ImmersiveMode) => {
    const enabling = immersiveMode !== mode;
    setImmersiveMode(enabling ? mode : null);
    run(() => SystemNavigationBar.setImmersive(mode, enabling));
  };

  const onSetBarStyle = (style: BarStyle) => {
    setBarStyle(style);
    run(() => SystemNavigationBar.setBarStyle(style, 'both'));
  };

  const onSetColor = (color: string) => {
    run(() =>
      SystemNavigationBar.setBarColor(color, {
        bar: barTarget,
        translucent,
        style: barStyle,
      })
    );
  };

  const onToggleContrast = (value: boolean) => {
    setContrastEnforced(value);
    run(() => SystemNavigationBar.setContrastEnforced(value));
  };

  const onToggleEdgeToEdge = (value: boolean) => {
    setEdgeToEdge(value);
    run(() => SystemNavigationBar.setEdgeToEdge(value));
  };

  const onToggleIndicator = (value: boolean) => {
    setIndicatorHidden(value);
    run(() => SystemNavigationBar.setHomeIndicatorAutoHidden(value));
  };

  const onToggleGestures = (value: boolean) => {
    setGesturesDeferred(value);
    run(() => SystemNavigationBar.setSystemGesturesDeferred(value));
  };

  const refreshStatus = () =>
    run(async () => {
      const [colors, e2e, mode] = await Promise.all([
        SystemNavigationBar.getBarColor(),
        SystemNavigationBar.isEdgeToEdgeEnabled(),
        SystemNavigationBar.getNavigationMode(),
      ]);
      setStatus({
        statusColor: colors.status,
        navigationColor: colors.navigation,
        edgeToEdge: String(e2e),
        navigationMode: mode,
      });
    });

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          System Navigation Bar
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          v3 API demo
        </Text>

        <Section title="Target bar" theme={theme}>
          <Row>
            {BAR_TARGETS.map((target) => (
              <Chip
                key={target}
                label={target}
                active={barTarget === target}
                theme={theme}
                onPress={() => setBarTarget(target)}
              />
            ))}
          </Row>
          <Row>
            <Button
              label="Hide"
              theme={theme}
              onPress={() => run(() => SystemNavigationBar.hide(barTarget))}
            />
            <Button
              label="Show"
              theme={theme}
              onPress={() => run(() => SystemNavigationBar.show(barTarget))}
            />
          </Row>
        </Section>

        <Section title="Immersive mode" theme={theme}>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Tap again to exit the active mode.
          </Text>
          <Row>
            {IMMERSIVE_MODES.map((mode) => (
              <Chip
                key={mode}
                label={mode}
                active={immersiveMode === mode}
                theme={theme}
                onPress={() => onToggleImmersive(mode)}
              />
            ))}
          </Row>
        </Section>

        <Section title="Bar icon style" theme={theme}>
          <Row>
            <Chip
              label="light icons"
              active={barStyle === 'light'}
              theme={theme}
              onPress={() => onSetBarStyle('light')}
            />
            <Chip
              label="dark icons"
              active={barStyle === 'dark'}
              theme={theme}
              onPress={() => onSetBarStyle('dark')}
            />
          </Row>
        </Section>

        <Section title="Bar color" theme={theme}>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            Applies to the selected target bar. No-op under enforced
            edge-to-edge (Android 15+, targetSdk 35+).
          </Text>
          <ToggleRow
            label="Translucent"
            value={translucent}
            onValueChange={setTranslucent}
            theme={theme}
          />
          <Row>
            {COLOR_PRESETS.map((preset) => (
              <Pressable
                key={preset.value}
                onPress={() => onSetColor(preset.value)}
                style={({ pressed }) => [
                  styles.swatch,
                  { borderColor: theme.border, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <View
                  style={[
                    styles.swatchColor,
                    {
                      backgroundColor: preset.value,
                      borderColor: theme.border,
                    },
                  ]}
                />
                <Text style={[styles.swatchLabel, { color: theme.text }]}>
                  {preset.label}
                </Text>
              </Pressable>
            ))}
          </Row>
        </Section>

        <Section title="Divider color (Android 9+)" theme={theme}>
          <Row>
            {DIVIDER_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                label={preset.label}
                theme={theme}
                onPress={() =>
                  run(() => SystemNavigationBar.setDividerColor(preset.value))
                }
              />
            ))}
          </Row>
        </Section>

        <Section title="Window flags" theme={theme}>
          <ToggleRow
            label="Contrast enforced (Android 10+)"
            value={contrastEnforced}
            onValueChange={onToggleContrast}
            theme={theme}
          />
          <ToggleRow
            label="Edge-to-edge"
            value={edgeToEdge}
            onValueChange={onToggleEdgeToEdge}
            theme={theme}
          />
        </Section>

        <Section title="iOS home indicator" theme={theme}>
          <ToggleRow
            label="Auto-hide indicator"
            value={indicatorHidden}
            onValueChange={onToggleIndicator}
            theme={theme}
          />
          <ToggleRow
            label="Defer system gestures (swipe twice to exit)"
            value={gesturesDeferred}
            onValueChange={onToggleGestures}
            theme={theme}
          />
        </Section>

        <Section title="Status" theme={theme}>
          <Row>
            <Button label="Refresh" theme={theme} onPress={refreshStatus} />
          </Row>
          {status ? (
            <View style={styles.statusBlock}>
              <StatusLine
                label="Status bar color"
                value={status.statusColor}
                theme={theme}
              />
              <StatusLine
                label="Navigation bar color"
                value={status.navigationColor}
                theme={theme}
              />
              <StatusLine
                label="Edge-to-edge"
                value={status.edgeToEdge}
                theme={theme}
              />
              <StatusLine
                label="Navigation mode"
                value={status.navigationMode}
                theme={theme}
              />
            </View>
          ) : (
            <Text style={[styles.hint, { color: theme.textMuted }]}>
              Press Refresh to read the current values.
            </Text>
          )}
        </Section>

        {lastError ? (
          <Text style={styles.error}>Error: {lastError}</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

type Theme = {
  background: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
};

const lightTheme: Theme = {
  background: '#F4F4F5',
  card: '#FFFFFF',
  border: '#E4E4E7',
  text: '#18181B',
  textMuted: '#71717A',
  accent: '#4F46E5',
  accentText: '#FFFFFF',
};

const darkTheme: Theme = {
  background: '#0B0B0F',
  card: '#18181B',
  border: '#27272A',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  accent: '#818CF8',
  accentText: '#0B0B0F',
};

function Section({
  title,
  theme,
  children,
}: {
  title: string;
  theme: Theme;
  children: ReactNode;
}) {
  return (
    <View
      style={[
        styles.section,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

function Button({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.accent,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text style={[styles.buttonLabel, { color: theme.accentText }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Chip({
  label,
  active,
  onPress,
  theme,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? theme.accent : 'transparent',
          borderColor: active ? theme.accent : theme.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.chipLabel,
          { color: active ? theme.accentText : theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
  theme,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  theme: Theme;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={[styles.toggleLabel, { color: theme.text }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: theme.accent }}
      />
    </View>
  );
}

function StatusLine({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: Theme;
}) {
  return (
    <View style={styles.statusLine}>
      <Text style={[styles.statusLabel, { color: theme.textMuted }]}>
        {label}
      </Text>
      <Text style={[styles.statusValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 64,
    paddingBottom: 48,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  swatch: {
    alignItems: 'center',
    gap: 4,
  },
  swatchColor: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
  },
  swatchLabel: {
    fontSize: 11,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 14,
    flexShrink: 1,
    paddingRight: 12,
  },
  statusBlock: {
    gap: 6,
  },
  statusLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusLabel: {
    fontSize: 13,
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  error: {
    color: '#EF4444',
    fontSize: 13,
  },
});

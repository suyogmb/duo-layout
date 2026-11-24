import { Link, Stack, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { DebugBadge } from '@/components/DebugBadge';
import { useDuoLayout } from '@/layout/useDuoLayout';
import { SelectionProvider } from '@/state/SelectionContext';

function Overlays() {
  const { win, hinge } = useDuoLayout();
  const insets = useSafeAreaInsets();
  const onGrid = usePathname() === '/grid';
  return (
    <>
      <DebugBadge win={win} hinge={hinge} style={{ top: insets.top + 8, right: insets.right + 8 }} />
      <Link href={onGrid ? '/' : '/grid'} replace style={[styles.switch, { bottom: insets.bottom + 12, left: insets.left + 12 }]}>
        <Text style={styles.switchText}>{onGrid ? 'Show list' : 'Show grid'}</Text>
      </Link>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SelectionProvider>
        <View style={styles.fill}>
          <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
          <Overlays />
        </View>
      </SelectionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#fff' },
  switch: { position: 'absolute', backgroundColor: '#2f6fed', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, overflow: 'hidden' },
  switchText: { color: '#fff', fontWeight: '600' },
});

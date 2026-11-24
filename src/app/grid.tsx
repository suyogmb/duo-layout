import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDuoLayout } from '@/layout/useDuoLayout';
import { Grid } from '@/screens/Grid';

export default function GridRoute() {
  const { win, layout } = useDuoLayout();
  return layout.kind === 'single' ? (
    <SafeAreaView style={styles.fill}><Grid layout={layout} mode={win.mode} /></SafeAreaView>
  ) : (
    <View style={styles.fill}><Grid layout={layout} mode={win.mode} /></View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1, backgroundColor: '#fff' } });

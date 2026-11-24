import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDuoLayout } from '@/layout/useDuoLayout';
import { ListDetail } from '@/screens/ListDetail';

export default function ListDetailRoute() {
  const { layout } = useDuoLayout();
  // Split panes are placed in raw window coordinates (to match the crease) and pad themselves.
  return layout.kind === 'single' ? (
    <SafeAreaView style={styles.fill}><ListDetail layout={layout} /></SafeAreaView>
  ) : (
    <View style={styles.fill}><ListDetail layout={layout} /></View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1, backgroundColor: '#fff' } });

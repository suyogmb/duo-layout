import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ITEMS } from '@/data/items';
import { useSelection } from '@/state/SelectionContext';

export function ItemDetail({ showBack }: { showBack: boolean }) {
  const { selectedId, select } = useSelection();
  const item = ITEMS.find((i) => i.id === selectedId);

  if (!item) {
    return (
      <View style={styles.empty}>
        <Text style={styles.muted}>Select an item</Text>
      </View>
    );
  }

  return (
    <ScrollView testID={`detail-${item.id}`} contentContainerStyle={styles.body}>
      {showBack && (
        <Pressable testID="back" onPress={() => select(null)} hitSlop={12}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: '#888', fontSize: 17 },
  body: { padding: 20, gap: 12 },
  back: { color: '#2f6fed', fontSize: 17 },
  title: { fontSize: 26, fontWeight: '600' },
  text: { fontSize: 16, lineHeight: 24 },
});

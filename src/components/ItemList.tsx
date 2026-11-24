import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

import { ITEMS } from '@/data/items';
import { useSelection } from '@/state/SelectionContext';

export function ItemList() {
  const { selectedId, select } = useSelection();
  return (
    <FlatList
      testID="item-list"
      data={ITEMS}
      keyExtractor={(i) => i.id}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => select(item.id)}
          style={[styles.row, item.id === selectedId && styles.selected]}
        >
          <Text style={styles.title}>{item.title}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 72 }, // room for the floating list/grid switch
  row: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ccc' },
  selected: { backgroundColor: '#e3ecff' },
  title: { fontSize: 17 },
});

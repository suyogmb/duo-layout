import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SplitView } from '@/components/SplitView';
import { ITEMS, type Item } from '@/data/items';
import { gridColumns } from '@/layout/gridColumns';
import type { LayoutMode } from '@/layout/layoutMode';
import type { Layout } from '@/layout/resolveLayout';

function Tiles({ testID, items, columns }: { testID: string; items: Item[]; columns: number }) {
  const width = `${100 / columns}%` as const;
  return (
    <ScrollView testID={testID} contentContainerStyle={styles.list}>
      {items.map((item) => (
        <View key={item.id} testID={`tile-${item.id}`} style={[styles.cell, { width }]}>
          <View style={styles.tile}>
            <Text style={styles.tileText}>{item.title}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

/** Split layouts get one grid per side so no tile straddles the crease. */
export function Grid({ layout, mode }: { layout: Layout; mode: LayoutMode }) {
  const columns = gridColumns(mode);
  if (layout.kind === 'single') {
    return <Tiles testID="grid-single" items={ITEMS} columns={columns} />;
  }
  const half = Math.ceil(ITEMS.length / 2);
  const perSide = Math.max(2, columns / 2);
  return (
    <SplitView
      layout={layout}
      first={<Tiles testID="grid-first" items={ITEMS.slice(0, half)} columns={perSide} />}
      second={<Tiles testID="grid-second" items={ITEMS.slice(half)} columns={perSide} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 8, paddingBottom: 72, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { padding: 6 },
  tile: {
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#e3ecff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tileText: { fontSize: 15, textAlign: 'center' },
});

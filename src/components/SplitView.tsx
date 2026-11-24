import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Rect } from '@/hinge/types';
import type { Layout } from '@/layout/resolveLayout';

type Props = { layout: Exclude<Layout, { kind: 'single' }>; first: ReactNode; second: ReactNode };

const at = (r: Rect) => ({ left: r.x, top: r.y, width: r.width, height: r.height });

/** Places two panes at the exact rects resolveLayout() computed (gap = crease). */
export function SplitView({ layout, first, second }: Props) {
  return (
    <View style={styles.fill}>
      <View testID="pane-first" style={[styles.pane, at(layout.first)]}>
        <SafeAreaView style={styles.fill}>{first}</SafeAreaView>
      </View>
      <View testID="pane-second" style={[styles.pane, at(layout.second)]}>
        <SafeAreaView style={styles.fill}>{second}</SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pane: { position: 'absolute', overflow: 'hidden' },
});

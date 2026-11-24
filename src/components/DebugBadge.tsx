import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import type { HingeState } from '@/hinge/types';
import type { WindowLayout } from '@/layout/layoutMode';

type Props = { win: WindowLayout; hinge: HingeState | null; style?: object };

function hingeLines(hinge: HingeState | null): string[] {
  if (!hinge) return ['no hinge'];
  const f = hinge.foldRect;
  const fold = f ? `fold ${Math.round(f.x)},${Math.round(f.y)} ${Math.round(f.width)}×${Math.round(f.height)}` : 'no fold';
  return [`${hinge.pose} · ${Math.round(hinge.angle)}°`, fold];
}

/** Tap to collapse/expand. Shows what the layout logic is seeing. */
export function DebugBadge({ win, hinge, style }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pose = hinge?.pose ?? 'no hinge';
  const text = collapsed
    ? `${win.mode} · ${pose}`
    : [`${Math.round(win.width)}×${Math.round(win.height)}`, `${win.mode} · ${win.orientation}`, ...hingeLines(hinge)].join('\n');

  return (
    <Pressable testID="debug-badge" onPress={() => setCollapsed((c) => !c)} style={[styles.badge, style]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10 },
  text: { color: '#fff', fontSize: 12, fontFamily: 'Menlo', lineHeight: 16 },
});

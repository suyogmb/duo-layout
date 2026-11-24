import type { LayoutMode } from './layoutMode';

export function gridColumns(mode: LayoutMode): 2 | 4 {
  return mode === 'expanded' ? 4 : 2;
}

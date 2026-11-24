import { useMemo } from 'react';

import { useHinge } from '@/hinge/useHinge';
import { resolveLayout } from './resolveLayout';
import { useLayoutMode } from './useLayoutMode';

/** Everything a screen needs: window info, hinge state, and the resolved pane layout. */
export function useDuoLayout() {
  const win = useLayoutMode();
  const hinge = useHinge();
  const layout = useMemo(() => resolveLayout(win, hinge), [win, hinge]);
  return { win, hinge, layout };
}

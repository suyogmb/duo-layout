import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { getLayoutMode, type WindowLayout } from './layoutMode';

export function useLayoutMode(): WindowLayout {
  const { width, height } = useWindowDimensions();
  return useMemo(() => getLayoutMode(width, height), [width, height]);
}

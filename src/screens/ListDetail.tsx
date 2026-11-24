import { ItemDetail } from '@/components/ItemDetail';
import { ItemList } from '@/components/ItemList';
import { SplitView } from '@/components/SplitView';
import type { Layout } from '@/layout/resolveLayout';
import { useSelection } from '@/state/SelectionContext';

/**
 * single      → list, or detail (+ back) when something is selected
 * side-by-side → list | detail
 * top-bottom   → detail on top, list below (laptop pose)
 */
export function ListDetail({ layout }: { layout: Layout }) {
  const { selectedId } = useSelection();

  if (layout.kind === 'single') {
    return selectedId ? <ItemDetail showBack /> : <ItemList />;
  }

  const list = <ItemList />;
  const detail = <ItemDetail showBack={false} />;
  return layout.kind === 'side-by-side'
    ? <SplitView layout={layout} first={list} second={detail} />
    : <SplitView layout={layout} first={detail} second={list} />;
}

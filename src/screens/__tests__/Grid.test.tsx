import { render, screen, within } from '@testing-library/react-native';

import { ITEMS } from '@/data/items';
import type { Layout } from '@/layout/resolveLayout';
import { Grid } from '../Grid';

const split: Layout = {
  kind: 'side-by-side',
  first: { x: 0, y: 0, width: 405, height: 900 },
  second: { x: 415, y: 0, width: 405, height: 900 },
};

describe('Grid', () => {
  it('shows one grid with all items in single layout', async () => {
    await render(<Grid layout={{ kind: 'single' }} mode="compact" />);
    expect(screen.getAllByTestId(/^tile-/)).toHaveLength(ITEMS.length);
    expect(screen.queryByTestId('grid-second')).toBeNull();
  });

  it('uses 2 columns in single compact layout', async () => {
    await render(<Grid layout={{ kind: 'single' }} mode="compact" />);
    expect(screen.getByTestId('tile-1')).toHaveStyle({ width: '50%' });
  });

  it('uses 4 columns in single expanded layout (no hinge, e.g. iPad)', async () => {
    await render(<Grid layout={{ kind: 'single' }} mode="expanded" />);
    expect(screen.getByTestId('tile-1')).toHaveStyle({ width: '25%' });
  });

  it('splits items in half across the crease', async () => {
    await render(<Grid layout={split} mode="expanded" />);
    const first = within(screen.getByTestId('grid-first')).getAllByTestId(/^tile-/);
    const second = within(screen.getByTestId('grid-second')).getAllByTestId(/^tile-/);
    expect(first).toHaveLength(10);
    expect(second).toHaveLength(10);
    expect(first[0].props.testID).toBe('tile-1');
    expect(second[0].props.testID).toBe('tile-11');
  });

  it('gives each half 2 columns when expanded (4 total)', async () => {
    await render(<Grid layout={split} mode="expanded" />);
    expect(screen.getByTestId('tile-1')).toHaveStyle({ width: '50%' });
    expect(screen.getByTestId('tile-11')).toHaveStyle({ width: '50%' });
  });
});

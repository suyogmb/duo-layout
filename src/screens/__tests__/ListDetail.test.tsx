import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { ITEMS } from '@/data/items';
import type { Layout } from '@/layout/resolveLayout';
import { SelectionProvider } from '@/state/SelectionContext';
import { ListDetail } from '../ListDetail';

const single: Layout = { kind: 'single' };
const sideBySide: Layout = {
  kind: 'side-by-side',
  first: { x: 0, y: 0, width: 405, height: 900 },
  second: { x: 415, y: 0, width: 405, height: 900 },
};
const topBottom: Layout = {
  kind: 'top-bottom',
  first: { x: 0, y: 0, width: 900, height: 405 },
  second: { x: 0, y: 415, width: 900, height: 405 },
};

const ui = (layout: Layout) => (
  <SelectionProvider>
    <ListDetail layout={layout} />
  </SelectionProvider>
);

describe('ListDetail', () => {
  it('shows the list in single layout with nothing selected', async () => {
    await render(ui(single));
    expect(screen.getByTestId('item-list')).toBeTruthy();
    expect(screen.queryByTestId(/^detail-/)).toBeNull();
  });

  it('opens detail in single layout when an item is tapped, with a back button', async () => {
    await render(ui(single));
    await fireEvent.press(screen.getByText(ITEMS[2].title));
    expect(screen.getByTestId('detail-3')).toBeTruthy();
    expect(screen.queryByTestId('item-list')).toBeNull();
    await fireEvent.press(screen.getByTestId('back'));
    expect(screen.getByTestId('item-list')).toBeTruthy();
  });

  it('keeps selection when unfolding to side-by-side, list first', async () => {
    await render(ui(single));
    await fireEvent.press(screen.getByText(ITEMS[2].title));
    await screen.rerender(ui(sideBySide));
    expect(within(screen.getByTestId('pane-first')).getByTestId('item-list')).toBeTruthy();
    expect(within(screen.getByTestId('pane-second')).getByTestId('detail-3')).toBeTruthy();
  });

  it('shows the selected detail, not the list, when folding closed', async () => {
    await render(ui(sideBySide));
    await fireEvent.press(screen.getByText(ITEMS[2].title));
    await screen.rerender(ui(single));
    expect(screen.getByTestId('detail-3')).toBeTruthy();
    expect(screen.queryByTestId('item-list')).toBeNull();
  });

  it('keeps selection when rotating to top-bottom, detail on top', async () => {
    await render(ui(sideBySide));
    await fireEvent.press(screen.getByText(ITEMS[2].title));
    await screen.rerender(ui(topBottom));
    expect(within(screen.getByTestId('pane-first')).getByTestId('detail-3')).toBeTruthy();
    expect(within(screen.getByTestId('pane-second')).getByTestId('item-list')).toBeTruthy();
  });

  it('shows a placeholder in split layout with nothing selected', async () => {
    await render(ui(sideBySide));
    expect(screen.getByText('Select an item')).toBeTruthy();
  });

  it('has no back button in split layout', async () => {
    await render(ui(sideBySide));
    await fireEvent.press(screen.getByText(ITEMS[2].title));
    expect(screen.queryByTestId('back')).toBeNull();
  });

  it('positions panes at the layout rects', async () => {
    await render(ui(sideBySide));
    expect(screen.getByTestId('pane-second')).toHaveStyle({ left: 415, top: 0, width: 405, height: 900 });
  });
});

it('pads the list bottom so the floating switch button does not cover the last row', async () => {
  await render(ui(single));
  expect(screen.getByTestId('item-list').props.contentContainerStyle).toMatchObject({ paddingBottom: 72 });
});

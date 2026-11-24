import { fireEvent, render, screen } from '@testing-library/react-native';

import type { HingeState } from '@/hinge/types';
import { getLayoutMode } from '@/layout/layoutMode';
import { DebugBadge } from '../DebugBadge';

const win = getLayoutMode(820, 900);
const hinge: HingeState = {
  pose: 'half',
  angle: 90,
  foldRect: { x: 405, y: 0, width: 10, height: 900 },
  foldDirection: 'vertical',
};

describe('DebugBadge', () => {
  it('shows window, mode, orientation, pose, angle and fold', async () => {
    await render(<DebugBadge win={win} hinge={hinge} />);
    for (const text of ['820×900', 'expanded', 'portrait', 'half', '90°', 'fold 405,0 10×900']) {
      expect(screen.getByText(text, { exact: false })).toBeTruthy();
    }
  });

  it('says "no hinge" when hinge is null', async () => {
    await render(<DebugBadge win={win} hinge={null} />);
    expect(screen.getByText('no hinge', { exact: false })).toBeTruthy();
  });

  it('says "no fold" when the hinge has no fold rect', async () => {
    await render(<DebugBadge win={win} hinge={{ ...hinge, foldRect: null, foldDirection: null }} />);
    expect(screen.getByText('no fold', { exact: false })).toBeTruthy();
  });

  it('rounds the angle', async () => {
    await render(<DebugBadge win={win} hinge={{ ...hinge, angle: 89.6 }} />);
    expect(screen.getByText('90°', { exact: false })).toBeTruthy();
  });

  it('collapses to mode + pose on tap and expands again', async () => {
    await render(<DebugBadge win={win} hinge={hinge} />);
    await fireEvent.press(screen.getByTestId('debug-badge'));
    expect(screen.getByText('expanded · half')).toBeTruthy();
    expect(screen.queryByText('820×900', { exact: false })).toBeNull();
    await fireEvent.press(screen.getByTestId('debug-badge'));
    expect(screen.getByText('820×900', { exact: false })).toBeTruthy();
  });
});

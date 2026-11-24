import type { FoldDirection, HingeState, Pose, Rect } from '@/hinge/types';
import { getLayoutMode } from '../layoutMode';
import { resolveLayout } from '../resolveLayout';

function hinge(pose: Pose, foldRect: Rect | null): HingeState {
  const foldDirection: FoldDirection | null = foldRect
    ? foldRect.height > foldRect.width ? 'vertical' : 'horizontal'
    : null;
  return { pose, angle: pose === 'flat' ? 180 : 90, foldRect, foldDirection };
}

const win = getLayoutMode(820, 900);
const vFold = { x: 405, y: 0, width: 10, height: 900 };
const hFold = { x: 0, y: 405, width: 900, height: 10 };

describe('resolveLayout', () => {
  it('is single on a compact window even if hinge says flat', () => {
    expect(resolveLayout(getLayoutMode(390, 844), hinge('flat', vFold)).kind).toBe('single');
  });
  it('is single on a compact window without hinge', () => {
    expect(resolveLayout(getLayoutMode(390, 844), null).kind).toBe('single');
  });
  it('splits 40/60 when expanded with no hinge', () => {
    expect(resolveLayout(win, null)).toEqual({
      kind: 'side-by-side',
      first: { x: 0, y: 0, width: 328, height: 900 },
      second: { x: 328, y: 0, width: 492, height: 900 },
    });
  });
  it('splits exactly at the crease when flat', () => {
    expect(resolveLayout(win, hinge('flat', vFold))).toEqual({
      kind: 'side-by-side',
      first: { x: 0, y: 0, width: 405, height: 900 },
      second: { x: 415, y: 0, width: 405, height: 900 },
    });
  });
  it('is side-by-side when half-folded with a vertical crease', () => {
    expect(resolveLayout(win, hinge('half', vFold)).kind).toBe('side-by-side');
  });
  it('is top-bottom when half-folded with a horizontal crease', () => {
    expect(resolveLayout(getLayoutMode(900, 820), hinge('half', hFold))).toEqual({
      kind: 'top-bottom',
      first: { x: 0, y: 0, width: 900, height: 405 },
      second: { x: 0, y: 415, width: 900, height: 405 },
    });
  });
  it('splits 50/50 with no gap when half-folded portrait without fold rect', () => {
    expect(resolveLayout(win, hinge('half', null))).toEqual({
      kind: 'side-by-side',
      first: { x: 0, y: 0, width: 410, height: 900 },
      second: { x: 410, y: 0, width: 410, height: 900 },
    });
  });
  it('is top-bottom 50/50 when half-folded landscape without fold rect', () => {
    expect(resolveLayout(getLayoutMode(900, 820), hinge('half', null))).toEqual({
      kind: 'top-bottom',
      first: { x: 0, y: 0, width: 900, height: 410 },
      second: { x: 0, y: 410, width: 900, height: 410 },
    });
  });
  it('is single when closed even if the cover screen is wide (closed landscape)', () => {
    expect(resolveLayout(getLayoutMode(874, 402), hinge('closed', null)).kind).toBe('single');
  });
  it('ignores a stale fold rect that does not fit the window (mid-rotation) and falls back', () => {
    const staleVertical = { x: 405, y: 0, width: 10, height: 900 };
    expect(resolveLayout(getLayoutMode(900, 820), hinge('half', staleVertical))).toEqual({
      kind: 'top-bottom',
      first: { x: 0, y: 0, width: 900, height: 410 },
      second: { x: 0, y: 410, width: 900, height: 410 },
    });
  });
  it('ignores a fold rect that does not span the window', () => {
    const partial = { x: 405, y: 0, width: 10, height: 300 };
    expect(resolveLayout(win, hinge('flat', partial)).kind).toBe('side-by-side');
    expect(resolveLayout(win, hinge('flat', partial))).toMatchObject({ first: { width: 328 } });
  });
});


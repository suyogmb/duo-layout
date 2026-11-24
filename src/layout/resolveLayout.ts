import type { HingeState, Rect } from '@/hinge/types';
import type { WindowLayout } from './layoutMode';

export type SplitKind = 'side-by-side' | 'top-bottom';
export type Layout = { kind: 'single' } | { kind: SplitKind; first: Rect; second: Rect };

/** Share of the width the first pane gets when there is no crease to align to. */
const DEFAULT_FIRST_SHARE = 0.4;

function splitSideBySide(w: number, h: number, firstEnd: number, secondStart: number): Layout {
  return {
    kind: 'side-by-side',
    first: { x: 0, y: 0, width: firstEnd, height: h },
    second: { x: secondStart, y: 0, width: w - secondStart, height: h },
  };
}

function splitTopBottom(w: number, h: number, firstEnd: number, secondStart: number): Layout {
  return {
    kind: 'top-bottom',
    first: { x: 0, y: 0, width: w, height: firstEnd },
    second: { x: 0, y: secondStart, width: w, height: h - secondStart },
  };
}

/** Rounding slack (pt) when checking a fold rect against the window. */
const FIT_TOLERANCE = 1;

/**
 * A fold rect is only trusted if it crosses the whole window inside its bounds.
 * Native fold data and JS window size arrive separately; mid-rotation they can disagree.
 */
function fits(fold: Rect, direction: 'vertical' | 'horizontal', w: number, h: number): boolean {
  const t = FIT_TOLERANCE;
  const near = (a: number, b: number) => Math.abs(a - b) <= t;
  return direction === 'vertical'
    ? fold.x >= -t && fold.x + fold.width <= w + t && near(fold.y, 0) && near(fold.y + fold.height, h)
    : fold.y >= -t && fold.y + fold.height <= h + t && near(fold.x, 0) && near(fold.x + fold.width, w);
}

/**
 * Decide how screens arrange their two panes.
 * 1. Compact window, or device closed → single pane.
 * 2. Known crease that fits the window → split exactly around it.
 * 3. Half-folded without crease → 50/50; landscape = top/bottom (laptop pose).
 * 4. Otherwise → side-by-side 40/60.
 */
export function resolveLayout(win: WindowLayout, hinge: HingeState | null): Layout {
  const { width: w, height: h } = win;
  if (win.mode === 'compact' || hinge?.pose === 'closed') return { kind: 'single' };

  const fold = hinge?.foldRect;
  const dir = hinge?.foldDirection;
  if (fold && dir && fits(fold, dir, w, h)) {
    return dir === 'vertical'
      ? splitSideBySide(w, h, fold.x, fold.x + fold.width)
      : splitTopBottom(w, h, fold.y, fold.y + fold.height);
  }

  if (hinge?.pose === 'half') {
    return win.orientation === 'landscape'
      ? splitTopBottom(w, h, h / 2, h / 2)
      : splitSideBySide(w, h, w / 2, w / 2);
  }

  const firstWidth = Math.round(w * DEFAULT_FIRST_SHARE);
  return splitSideBySide(w, h, firstWidth, firstWidth);
}

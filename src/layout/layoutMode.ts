export type LayoutMode = 'compact' | 'expanded';
export type Orientation = 'portrait' | 'landscape';

export type WindowLayout = {
  mode: LayoutMode;
  orientation: Orientation;
  width: number;
  height: number;
};

/** Window width (pt) at or above which the app shows two panes. */
export const EXPANDED_MIN_WIDTH = 600;

export function getLayoutMode(width: number, height: number): WindowLayout {
  return {
    mode: width >= EXPANDED_MIN_WIDTH ? 'expanded' : 'compact',
    orientation: width > height ? 'landscape' : 'portrait',
    width,
    height,
  };
}

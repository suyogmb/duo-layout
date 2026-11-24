export type Rect = { x: number; y: number; width: number; height: number };

/** Posture as reported by the OS hinge API, when available. */
export type NativeHingeStatus = 'closed' | 'partiallyOpen' | 'fullyOpen' | 'unknown';

/** Exact payload the native duo-hinge module reports. `angle` is in degrees. */
export type RawHinge = {
  angle: number;
  status?: NativeHingeStatus;
  innerDisplayActive: boolean;
  foldRect: Rect | null;
};

export type Pose = 'closed' | 'half' | 'flat';
export type FoldDirection = 'vertical' | 'horizontal';

export type HingeState = {
  pose: Pose;
  angle: number;
  foldRect: Rect | null;
  foldDirection: FoldDirection | null;
};

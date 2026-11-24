import type { FoldDirection, HingeState, NativeHingeStatus, Pose, RawHinge, Rect } from './types';

/** Hinge angle (degrees) at or above which the device counts as open flat. */
export const FLAT_MIN_ANGLE = 165;

const POSE_BY_STATUS: Record<NativeHingeStatus, Pose> = {
  closed: 'closed',
  partiallyOpen: 'half',
  fullyOpen: 'flat',
  unknown: 'flat', // OS can't tell yet; assume the common open state
};

function poseOf(raw: RawHinge): Pose {
  if (raw.status) return POSE_BY_STATUS[raw.status];
  if (!raw.innerDisplayActive) return 'closed';
  return raw.angle >= FLAT_MIN_ANGLE ? 'flat' : 'half';
}

function directionOf(rect: Rect | null): FoldDirection | null {
  if (!rect) return null;
  return rect.height > rect.width ? 'vertical' : 'horizontal';
}

export function toHingeState(raw: RawHinge | null): HingeState | null {
  if (!raw) return null;
  return {
    pose: poseOf(raw),
    angle: raw.angle,
    foldRect: raw.foldRect,
    foldDirection: directionOf(raw.foldRect),
  };
}

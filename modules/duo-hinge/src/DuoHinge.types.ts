import type { RawHinge } from '../../../src/hinge/types';

export type DuoHingeModuleEvents = {
  /** `value` is absent when the device reports no hinge. */
  onHingeChange: (event: { value?: RawHinge }) => void;
};

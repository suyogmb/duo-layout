import { NativeModule, requireOptionalNativeModule } from 'expo';

import type { RawHinge } from '../../../src/hinge/types';
import type { DuoHingeModuleEvents } from './DuoHinge.types';

declare class DuoHingeModule extends NativeModule<DuoHingeModuleEvents> {
  /** Current hinge state, or null on devices without a hinge. */
  getHingeState(): RawHinge | null;
}

/** null where the native module isn't compiled in (Android, web, Expo Go, tests). */
export default requireOptionalNativeModule<DuoHingeModule>('DuoHinge');

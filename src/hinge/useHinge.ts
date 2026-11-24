import { useEffect, useState } from 'react';

import DuoHinge from '../../modules/duo-hinge';
import { toHingeState } from './pose';
import type { HingeState, RawHinge } from './types';

function read(): RawHinge | null {
  return DuoHinge?.getHingeState() ?? null;
}

/** Live hinge pose + fold position. null on devices without a hinge. */
export function useHinge(): HingeState | null {
  const [raw, setRaw] = useState<RawHinge | null>(read);

  useEffect(() => {
    if (!DuoHinge) return;
    const sub = DuoHinge.addListener('onHingeChange', (e) => setRaw(e.value ?? null));
    return () => sub.remove();
  }, []);

  return toHingeState(raw);
}

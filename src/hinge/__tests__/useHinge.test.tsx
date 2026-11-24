import { act, renderHook } from '@testing-library/react-native';

import type { RawHinge } from '../types';

import { useHinge } from '../useHinge';

type Listener = (e: { value?: RawHinge }) => void;
const mockListeners: Listener[] = [];
const mockRemove = jest.fn();
const mockGet = jest.fn<RawHinge | null, []>();

jest.mock('../../../modules/duo-hinge', () => ({
  __esModule: true,
  default: {
    getHingeState: () => mockGet(),
    addListener: (_: string, l: Listener) => {
      mockListeners.push(l);
      return { remove: mockRemove };
    },
  },
}));

const emit = (p: RawHinge | null) => mockListeners.forEach((l) => l(p ? { value: p } : {}));

beforeEach(() => {
  mockListeners.length = 0;
  mockRemove.mockClear();
});

describe('useHinge', () => {
  it('is null when the device has no hinge', async () => {
    mockGet.mockReturnValue(null);
    expect((await renderHook(useHinge)).result.current).toBeNull();
  });

  it('derives state from the initial native value', async () => {
    mockGet.mockReturnValue({ angle: 90, innerDisplayActive: true, foldRect: null });
    expect((await renderHook(useHinge)).result.current!.pose).toBe('half');
  });

  it('updates when the native module emits a change', async () => {
    mockGet.mockReturnValue({ angle: 90, innerDisplayActive: true, foldRect: null });
    const { result } = await renderHook(useHinge);
    await act(async () => emit({ angle: 180, innerDisplayActive: true, foldRect: null }));
    expect(result.current!.pose).toBe('flat');
  });

  it('goes back to null when native reports no hinge', async () => {
    mockGet.mockReturnValue({ angle: 90, innerDisplayActive: true, foldRect: null });
    const { result } = await renderHook(useHinge);
    await act(async () => emit(null));
    expect(result.current).toBeNull();
  });

  it('removes its listener on unmount', async () => {
    mockGet.mockReturnValue(null);
    const { unmount } = await renderHook(useHinge);
    await unmount();
    expect(mockRemove).toHaveBeenCalled();
  });
});

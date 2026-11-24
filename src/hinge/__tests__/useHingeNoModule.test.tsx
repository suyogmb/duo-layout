import { renderHook } from '@testing-library/react-native';

import { useHinge } from '../useHinge';

jest.mock('../../../modules/duo-hinge', () => ({ __esModule: true, default: null }));

it('is null when the native module is not compiled in', async () => {
  expect((await renderHook(useHinge)).result.current).toBeNull();
});

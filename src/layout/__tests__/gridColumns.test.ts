import { gridColumns } from '../gridColumns';

it('uses 2 columns when compact', () => expect(gridColumns('compact')).toBe(2));
it('uses 4 columns when expanded', () => expect(gridColumns('expanded')).toBe(4));

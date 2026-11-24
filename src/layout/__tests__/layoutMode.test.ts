import { getLayoutMode } from '../layoutMode';

describe('getLayoutMode', () => {
  it('is compact portrait on a closed phone', () => {
    expect(getLayoutMode(390, 844)).toMatchObject({ mode: 'compact', orientation: 'portrait' });
  });
  it('stays compact just under 600pt', () => {
    expect(getLayoutMode(599, 844).mode).toBe('compact');
  });
  it('is expanded at 600pt', () => {
    expect(getLayoutMode(600, 700).mode).toBe('expanded');
  });
  it('is expanded landscape when wide', () => {
    expect(getLayoutMode(844, 390)).toMatchObject({ mode: 'expanded', orientation: 'landscape' });
  });
  it('treats a square window as portrait', () => {
    expect(getLayoutMode(500, 500).orientation).toBe('portrait');
  });
  it('passes through width and height', () => {
    expect(getLayoutMode(820, 900)).toMatchObject({ width: 820, height: 900 });
  });
});

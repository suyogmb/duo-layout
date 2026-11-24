import { toHingeState } from '../pose';

const raw = (angle: number, innerDisplayActive = true, foldRect = null as any) => ({ angle, innerDisplayActive, foldRect });

describe('toHingeState', () => {
  it('returns null when there is no hinge', () => {
    expect(toHingeState(null)).toBeNull();
  });
  it('is closed when the inner display is inactive', () => {
    expect(toHingeState(raw(0, false))!.pose).toBe('closed');
  });
  it('is half at 90°', () => {
    expect(toHingeState(raw(90))!.pose).toBe('half');
  });
  it('is still half at 164°', () => {
    expect(toHingeState(raw(164))!.pose).toBe('half');
  });
  it('is flat at 165°', () => {
    expect(toHingeState(raw(165))!.pose).toBe('flat');
  });
  it('derives vertical direction from a tall fold rect', () => {
    expect(toHingeState(raw(90, true, { x: 400, y: 0, width: 10, height: 900 }))!.foldDirection).toBe('vertical');
  });
  it('derives horizontal direction from a wide fold rect', () => {
    expect(toHingeState(raw(90, true, { x: 0, y: 400, width: 900, height: 10 }))!.foldDirection).toBe('horizontal');
  });
  it('has null direction without a fold rect', () => {
    expect(toHingeState(raw(90))!.foldDirection).toBeNull();
  });
  it('keeps the angle', () => {
    expect(toHingeState(raw(120))!.angle).toBe(120);
  });
  it('prefers native status over angle: partiallyOpen is half even at 170°', () => {
    expect(toHingeState({ ...raw(170), status: 'partiallyOpen' })!.pose).toBe('half');
  });
  it('maps fullyOpen status to flat', () => {
    expect(toHingeState({ ...raw(150), status: 'fullyOpen' })!.pose).toBe('flat');
  });
  it('treats unknown status as flat', () => {
    expect(toHingeState({ ...raw(90), status: 'unknown' })!.pose).toBe('flat');
  });
  it('maps closed status to closed', () => {
    expect(toHingeState({ ...raw(0), status: 'closed' })!.pose).toBe('closed');
  });
});

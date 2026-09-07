import { getEnteringItemStaggerIndices } from './VerdictTimelineBody.logic'

describe('getEnteringItemStaggerIndices', () => {
  const items = (...texts: string[]) => texts.map((text) => ({ text }))

  it('should let nothing enter before the first render', () => {
    expect(
      getEnteringItemStaggerIndices(null, items('served', 'stance')),
    ).toEqual([undefined, undefined])
  })

  it('should let nothing enter when the items are unchanged', () => {
    expect(
      getEnteringItemStaggerIndices(
        new Set(['served', 'stance']),
        items('served', 'stance'),
      ),
    ).toEqual([undefined, undefined])
  })

  it('should let an appended item enter', () => {
    expect(
      getEnteringItemStaggerIndices(
        new Set(['requirement']),
        items('requirement', 'served'),
      ),
    ).toEqual([undefined, 0])
  })

  it('should stagger several appended items in list order', () => {
    expect(
      getEnteringItemStaggerIndices(
        new Set(['requirement']),
        items('requirement', 'served', 'deadline'),
      ),
    ).toEqual([undefined, 0, 1])
  })

  it('should let an item that replaces another at the same count enter', () => {
    expect(
      getEnteringItemStaggerIndices(
        new Set(['served', 'stance']),
        items('served', 'appealed'),
      ),
    ).toEqual([undefined, 0])
  })

  it('should let the first item enter when it is the one replaced', () => {
    expect(
      getEnteringItemStaggerIndices(
        new Set(['requirement', 'deadline']),
        items('served', 'deadline'),
      ),
    ).toEqual([0, undefined])
  })

  it('should stagger entering items by their order among each other, not their position', () => {
    expect(
      getEnteringItemStaggerIndices(
        new Set(['a', 'b', 'c']),
        items('a', 'x', 'c', 'y'),
      ),
    ).toEqual([undefined, 0, undefined, 1])
  })

  it('should let nothing enter when items are only removed', () => {
    expect(
      getEnteringItemStaggerIndices(
        new Set(['served', 'stance']),
        items('served'),
      ),
    ).toEqual([undefined])
  })

  it('should let every item enter when the list was empty', () => {
    expect(
      getEnteringItemStaggerIndices(new Set(), items('served', 'stance')),
    ).toEqual([0, 1])
  })
})

import { wrapAxisLabel } from './wrapAxisLabel'

const expectWithin = (lines: string[], maxCharsPerLine: number) => {
  for (const line of lines) {
    expect(line.length).toBeLessThanOrEqual(maxCharsPerLine)
  }
}

describe('wrapAxisLabel', () => {
  it('keeps short labels on one line', () => {
    expect(wrapAxisLabel('Fyrirtæki', 10, 3)).toEqual(['Fyrirtæki'])
  })

  it('wraps words greedily onto new lines', () => {
    expect(wrapAxisLabel('Aðrir aðilar', 10, 3)).toEqual(['Aðrir', 'aðilar'])
  })

  it('breaks a long Icelandic word at syllable boundaries within the width', () => {
    const lines = wrapAxisLabel('Sveitarfélög', 10, 3)

    expect(lines.length).toBeGreaterThan(1)
    expect(lines[0].endsWith('-')).toBe(true)
    expect(lines.join('').replace(/-/g, '')).toBe('Sveitarfélög')
    expectWithin(lines, 10)
  })

  it('splits a word with no syllable boundary instead of overflowing', () => {
    const lines = wrapAxisLabel('XQZWKPTRBNMVX', 10, 3)

    expect(lines.join('').replace(/-/g, '')).toBe('XQZWKPTRBNMVX')
    expectWithin(lines, 10)
  })

  it('keeps the ellipsis within the width when truncating', () => {
    const lines = wrapAxisLabel(
      'aaaaaaaaaa bbbbbbbbbb cccccccccc dddddddddd',
      10,
      3,
    )

    expect(lines).toHaveLength(3)
    expect(lines[2].endsWith('…')).toBe(true)
    expectWithin(lines, 10)
  })

  it('does not leave a hyphen before the ellipsis', () => {
    const lines = wrapAxisLabel('XQZWKPTRBNMVXQZWKPTRBNMVXQZWKPTRBNMVX', 10, 3)

    expect(lines[2]).not.toMatch(/-…$/)
    expectWithin(lines, 10)
  })
})

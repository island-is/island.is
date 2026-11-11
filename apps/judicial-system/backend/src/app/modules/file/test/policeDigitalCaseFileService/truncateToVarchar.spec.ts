import { truncateToVarchar } from '../../policeDigitalCaseFiles/truncateToVarchar'

const hasUnpairedSurrogate = (value: string): boolean => {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)

    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(i + 1)

      if (Number.isNaN(next) || next < 0xdc00 || next > 0xdfff) {
        return true
      }

      i += 1
      continue
    }

    if (code >= 0xdc00 && code <= 0xdfff) {
      return true
    }
  }

  return false
}

describe('truncateToVarchar', () => {
  it('returns the value unchanged when it fits', () => {
    expect(truncateToVarchar('short-name', 255)).toBe('short-name')
  })

  it('truncates values longer than the limit', () => {
    const value = 'a'.repeat(300)

    expect(truncateToVarchar(value, 255)).toBe('a'.repeat(255))
    expect([...truncateToVarchar(value, 255)]).toHaveLength(255)
  })

  it('defaults to 255 characters', () => {
    const value = 'b'.repeat(256)

    expect([...truncateToVarchar(value)]).toHaveLength(255)
  })

  it('does not leave an unpaired surrogate when truncating at a supplementary character', () => {
    const emoji = '😀' // U+1F600 — one code point, two UTF-16 code units
    // JS string length is 256; code-point length is 255. slice(0, 255) would
    // cut the emoji in half and leave a lone high surrogate.
    const value = `${'a'.repeat(254)}${emoji}`

    const result = truncateToVarchar(value, 255)

    expect(result).toBe(value)
    expect([...result]).toHaveLength(255)
    expect(hasUnpairedSurrogate(result)).toBe(false)
  })

  it('omits a trailing supplementary character when it would exceed the limit', () => {
    const emoji = '😀'
    const value = `${'a'.repeat(255)}${emoji}`

    const result = truncateToVarchar(value, 255)

    expect(result).toBe('a'.repeat(255))
    expect(result).not.toContain(emoji)
    expect(hasUnpairedSurrogate(result)).toBe(false)
  })
})

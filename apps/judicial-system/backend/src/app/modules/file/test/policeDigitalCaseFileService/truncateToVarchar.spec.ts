import { truncateToVarchar } from '../../policeDigitalCaseFiles/truncateToVarchar'

describe('truncateToVarchar', () => {
  it('returns the value unchanged when it fits', () => {
    expect(truncateToVarchar('short-name', 255)).toBe('short-name')
  })

  it('truncates values longer than the limit', () => {
    const value = 'a'.repeat(300)

    expect(truncateToVarchar(value, 255)).toBe('a'.repeat(255))
    expect(truncateToVarchar(value, 255)).toHaveLength(255)
  })

  it('defaults to 255 characters', () => {
    const value = 'b'.repeat(256)

    expect(truncateToVarchar(value)).toHaveLength(255)
  })
})

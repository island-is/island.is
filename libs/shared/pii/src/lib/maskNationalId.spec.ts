import { maskNationalId } from './maskNationalId'

describe('maskNationalId', () => {
  const ENV = process.env

  afterEach(() => {
    jest.resetModules()
    process.env = { ...ENV }
  })
  it('should mask national ids from text', () => {
    // Arrange
    const text = 'Test 0101307789, 010130-7789'

    // Act
    const result = maskNationalId(text)

    // Assert
    expect(result).toBe(
      'Test **REMOVE_PII: 0101307789**, **REMOVE_PII: 010130-7789**',
    )
  })

  it('should mask not mask 10 digit number from text', () => {
    // Arrange
    const text = 'Test 1234561234, 123456-1234'

    // Act
    const result = maskNationalId(text)

    // Assert
    expect(result).toBe(text)
  })

  it('should not display nationalId in production', async () => {
    // Arrange
    process.env.NODE_ENV = 'production'
    const text = 'https://island.is/api/0101307789/010130-7789/info'

    // Act
    const { maskNationalId } = await import('./maskNationalId')
    const result = maskNationalId(text)

    // Assert
    expect(result).toBe('https://island.is/api/--MASKED--/--MASKED--/info')
  })
})

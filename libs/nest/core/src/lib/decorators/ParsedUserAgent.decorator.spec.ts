import { parseUserAgent } from './ParsedUserAgent.decorator'

describe('parseUserAgent Function', () => {
  it('should parse new iOS app user agent', () => {
    // Arrange
    const userAgentString = 'IslandIsApp (1.0.0) Build/321 (ios/9.0.0)'

    // Act
    const result = parseUserAgent(userAgentString)

    // Assert
    expect(result).toEqual({
      ua: userAgentString,
      os: { name: 'iOS', version: '9.0.0' },
      app: { name: 'IslandIsApp', version: '1.0.0', build: 321 },
    })
  })

  it('should parse new Android app user agent', () => {
    // Arrange
    const userAgentString = 'IslandIsApp (2.1.0) Build/123 (android/11.0.0)'

    // Act
    const result = parseUserAgent(userAgentString)

    // Assert
    expect(result).toEqual({
      ua: userAgentString,
      os: { name: 'Android', version: '11.0.0' },
      app: { name: 'IslandIsApp', version: '2.1.0', build: 123 },
    })
  })

  it('should parse old iOS app user agent', () => {
    // Arrange
    const userAgentString = 'IslandApp/144 CFNetwork/1498.700.2 Darwin/23.6.0'

    // Act
    const result = parseUserAgent(userAgentString)

    // Assert
    expect(result).toEqual({
      ua: userAgentString,
      os: { name: 'iOS' },
      app: { name: 'IslandIsApp' },
    })
  })

  it('should parse old Android app user agent', () => {
    // Arrange
    const userAgentString = 'okhttp/4.9.2'

    // Act
    const result = parseUserAgent(userAgentString)

    // Assert
    expect(result).toEqual({
      ua: userAgentString,
      os: { name: 'Android' },
      app: { name: 'IslandIsApp' },
    })
  })

  it('should return empty app and os for unknown user agent', () => {
    // Arrange
    const userAgentString = 'UnknownUserAgent/1.0'

    // Act
    const result = parseUserAgent(userAgentString)

    // Assert
    expect(result).toEqual({
      ua: userAgentString,
      os: {},
      app: {},
    })
  })
})

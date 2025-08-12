import { createTraceSid } from './createTraceSid'

describe('createTraceSid', () => {
  const fixedDate = new Date('2024-01-15T12:34:56.789Z')

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(fixedDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('uses the provided hash function and formats the result into 4-4-4 hex groups', async () => {
    // Arrange
    // Dummy async hash: returns a predictable hex string (>= 12 chars)
    const dummyHash = jest.fn(
      async (data) => '00112233445566778899aabbccddeeff',
    )
    const sid = 'session-123'

    // Act
    const result = await createTraceSid(sid, dummyHash)

    // Assert
    // Ensures the hash function is invoked with "sid:YYYY-MM-DD"
    expect(dummyHash).toHaveBeenCalledTimes(1)
    expect(dummyHash).toHaveBeenCalledWith('session-123:2024-01-15')

    // Ensures only the first 12 hex chars are used and grouped as 4-4-4
    expect(result).toBe('0011-2233-4455')
  })

  it('is deterministic for the same sid and date with the same dummy hash', async () => {
    // Arrange
    const dummyHash = jest.fn(async () => 'a1b2c3d4e5f6a7b8c9d0')
    const sid = 's-42'

    // Act
    const r1 = await createTraceSid(sid, dummyHash)
    jest.advanceTimersByTime(1000)
    const r2 = await createTraceSid(sid, dummyHash)

    // Assert

    // Ensures the hash function is invoked with "sid:YYYY-MM-DD"
    expect(dummyHash).toHaveBeenCalledTimes(2)
    expect(dummyHash).toHaveBeenNthCalledWith(1, 's-42:2024-01-15')
    expect(dummyHash).toHaveBeenNthCalledWith(2, 's-42:2024-01-15')

    expect(r1).toBe('a1b2-c3d4-e5f6')
    expect(r2).toBe('a1b2-c3d4-e5f6')
  })

  it('only returns a traceSid if a valid hash is generated', async () => {
    // Arrange
    const dummyHash = jest.fn(async () => '')
    const sid = 's-42'

    // Act
    const result = await createTraceSid(sid, dummyHash)

    // Assert
    expect(result).toBeUndefined()
  })
})

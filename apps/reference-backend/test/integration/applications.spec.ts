import { Applications } from '../../src/app/applications'

describe('Applications registration', () => {
  it('should register valid ssn', async () => {
    // Arrange
    const app = new Applications();

    // Act
    const id = await app.register({ssn: '1234567890'})

    // Assert
    expect(id).toBeTruthy()
  })
  it('should throw an error when shorter ssn', async () => {
    // Arrange
    const app = new Applications();

    // Act/Assert
    await expect(app.register({ssn: '123456789'})).rejects.toThrow(new Error('SSN missing or invalid length 123456789'))
  })
})

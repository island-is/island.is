import { Applications } from '../../../src/data'

describe('Application model', () => {
  it('should provide a default id', async () => {
    // Arrange
    const app = new Applications();

    // Act
    const id = await app.register({ssn: '1234567890'})

    // Assert
    expect(id).toBeTruthy()
  })
})

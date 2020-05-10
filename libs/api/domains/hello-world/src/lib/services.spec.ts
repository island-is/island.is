import { getMessage } from './services'

describe('HelloWorld services', () => {
  describe('#getMessage', () => {
    it('says hello to the user', () => {
      // Arrange
      const name = 'Eiki'

      // Act
      const message = getMessage(name)

      // Assert
      expect(message).toEqual('Hello Eiki!')
    })
  })
})

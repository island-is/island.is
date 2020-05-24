import HelloWorldService from './service'

describe('HelloWorld services', () => {
  describe('#getMessage', () => {
    it('says hello to the user', () => {
      // Arrange
      const service = new HelloWorldService({
        getHelloWord() {
          return 'Test'
        },
      })
      const name = 'Eiki'

      // Act
      const message = service.getMessage(name)

      // Assert
      expect(message).toEqual('Test Eiki!')
    })
  })
})

import SearcherService from './service'

describe('Searcher services', () => {
  describe('#getMessage', () => {
    it('says hello to the user', () => {
      // Arrange
      const service = new SearcherService({
        getSearcher() {
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

import SearcherService from './service'
import { SearchIndexes } from '@island.is/api/content-search'

describe('Searcher services', () => {
  describe('#getMessage', () => {
    it('says hello to the user', () => {
      // Arrange
      //todo write test
      const service = new SearcherService()
      const name = 'Eiki'

      // Act
      const message = service.getMessage(name)

      // Assert
      expect(message).toEqual('Test Eiki!')
    })
  })
})

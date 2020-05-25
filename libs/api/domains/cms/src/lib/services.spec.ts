import { getArticle } from './services'

describe('Article services', () => {
  describe('#getArticle', () => {
    it('Respond with an article', () => {
      // Arrange
      const id = 'SomeId'

      // Act
      const article = getArticle(id)

      // Assert
      const expected = {
        id: 'someId',
        title: 'Some title',
        body: 'someBody of text!!!',
      }
      expect(article).toMatchObject(expected)
    })
  })
})

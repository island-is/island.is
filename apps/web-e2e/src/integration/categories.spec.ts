import { cms } from '@island.is/api/mocks'

describe('/flokkur', () => {
  beforeEach(() => cy.visit(`/flokkur/${cms.store.articleCategories[0].slug}`))

  it('should contain h1 title', () => {
    cy.get('h1').contains(cms.store.articleCategories[0].title)
  })
})

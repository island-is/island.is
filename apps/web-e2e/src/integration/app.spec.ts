import { cms } from '@island.is/api/mocks'

describe('web', () => {
  beforeEach(() => cy.visit('/'))

  it('should display front page slider', () => {
    // Function helper example, see `../support/app.po.ts` file
    cy.get('h1').contains(cms.store.frontPageSliders[0].title)
  })
})

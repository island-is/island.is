import { cms } from '@island.is/api/mocks'

describe('/flokkur', () => {
  beforeEach(() => {
    cy.visit(`/flokkur/${cms.store.articleCategories[0].slug}`)
    // This wait is probably too long, but some wait is needed so the e2e CI don't fail
    cy.wait(6000)
  })

  it('should contain h1 title', () => {
    cy.get('h1').contains(cms.store.articleCategories[0].title)
  })

  it('should have closed accordion cards', () => {
    cy.get(`[data-cy=accordion-item]`).should(
      'have.attr',
      'aria-expanded',
      'false',
    )
  })

  it('should open accordion card when clicked', () => {
    cy.get(`[data-cy=accordion-item]`)
      .first()
      .click()
      .should('have.attr', 'aria-expanded', 'true')
  })

  it('should have visible content when accordion card clicked', () => {
    cy.get(`[data-cy=accordion-item]`).first().click()

    cy.get(`[data-cy=accordion-item-content]`)
      .first()
      .should('have.attr', 'aria-hidden', 'false')
  })
})

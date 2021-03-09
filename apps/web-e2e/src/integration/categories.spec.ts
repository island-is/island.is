import { cms } from '@island.is/api/mocks'

describe('/flokkur', () => {
  beforeEach(() => {
    cy.visit(`/flokkur/${cms.store.articleCategories[0].slug}`)
    // TODO: Find better way so the e2e CI test doesn't fail without wait
    cy.wait(2000)
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

  it('should link to next category in navigation', () => {
    cy.get(`[data-cy=categories-navigation-link]`)
      .eq(1)
      .should(
        'have.attr',
        'href',
        `/flokkur/${cms.store.articleCategories[1].slug}`,
      )
  })

  it('should navigation to another category', () => {
    cy.get(`[data-cy=categories-navigation-link]`).eq(1).click()

    cy.get('h1').contains(cms.store.articleCategories[1].title)
  })
})

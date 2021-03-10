import { cms } from '@island.is/api/mocks'

const click = ($el: any) => $el.click()

describe('/flokkur', () => {
  beforeEach(() => {
    cy.visit(`/flokkur/${cms.store.articleCategories[0].slug}`)
  })

  it('should contain h1 title', () => {
    cy.get('h1').contains(cms.store.articleCategories[0].title)
  })

  it('should have closed accordion cards', () => {
    cy.get(`[data-cy=accordion-card-button]`).should(
      'have.attr',
      'aria-expanded',
      'false',
    )
  })

  it('should open accordion card when clicked', () => {
    cy.get(`[data-cy=accordion-card-0] [data-cy=accordion-card-button]`)
      .pipe(click)
      .should('have.attr', 'aria-expanded', 'true')
  })

  it('should have visible content when accordion card clicked', () => {
    cy.get(`[data-cy=accordion-card-0] [data-cy=accordion-card-button]`)
      .pipe(click)
      .then(() => {
        cy.get(`[data-cy=accordion-card-0] [data-cy=accordion-card-content]`)
          .should('have.attr', 'aria-hidden', 'false')
          .should('be.visible')
      })
  })

  it('should link to next category in navigation', () => {
    cy.get(`[data-cy=categories-navigation-link-1]`).should(
      'have.attr',
      'href',
      `/flokkur/${cms.store.articleCategories[1].slug}`,
    )
  })

  it('should navigate to next category', () => {
    cy.visit(`/flokkur/${cms.store.articleCategories[1].slug}`)
    cy.get('h1').contains(cms.store.articleCategories[1].title)
  })
})

import { cms } from '@island.is/api/mocks'

describe('homepage', () => {
  beforeEach(() => cy.visit('/'))

  it('should have a front page slide', () => {
    cy.get('h1#frontpageTabTitle0').contains(
      cms.store.frontpage.slides[0].title,
    )
  })

  it('should have the next frontpage slide', () => {
    cy.get('h1#frontpageTabTitle1').contains(
      cms.store.frontpage.slides[1].title,
    )
  })

  it('should link to life event page', () => {
    cy.get(
      `[data-cy=clickable-card-${cms.store.frontpage.lifeEvents[0].title.replace(
        / /g,
        '',
      )}]`,
    ).should(
      'have.attr',
      'href',
      `/lifsvidburdir/${cms.store.frontpage.lifeEvents[0].slug}`,
    )
  })

  it('should link to life events overview page', () => {
    cy.get(`[data-cy=overview-link]`).should(
      'have.attr',
      'href',
      `/lifsvidburdir`,
    )
  })

  it('should display the main menu overlay', () => {
    cy.get(`[data-cy="main-menu-button"]:visible`).click()
    cy.get(`[data-dialog-ref="Menu"]`).should('exist').should('be.visible')
  })
})

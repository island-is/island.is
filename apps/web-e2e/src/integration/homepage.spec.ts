import { cms } from '@island.is/api/mocks'

describe('homepage', () => {
  beforeEach(() => cy.visit('/'))

  it('should display front page slider', () => {
    // Function helper example, see `../support/app.po.ts` file
    cy.get('h1').contains(cms.store.frontpage.slides[0].title)
  })

  it('should display next frontpage slide', () => {
    cy.get('[aria-label="frontpageTabsNext"]')
    cy.get('h1').contains(cms.store.frontpage.slides[1].title)
  })

  it('should link to life event page', () => {
    cy.get(
      `[id=clickable-card-${cms.store.frontpage.lifeEvents[0].title.replace(
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
    cy.get(`[id=overview-link]`).should('have.attr', 'href', `/lifsvidburdir`)
  })
})

import { idsLogin } from '../../support/commands'

describe('Home page', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')

  beforeEach(() => {
    cy.session('idsLogin', () => {
      idsLogin({
        phoneNumber: fakeUsers[2].phoneNumber,
        urlPath: '/min-rettindi',
        fn: () => cy.get('[data-testid="show-benefits-button"]').click(),
      })
      cy.contains(fakeUsers[2].name)
    })
  })
  it(`should have user ${fakeUsers[2].name} logged in`, () => {
    cy.visit('/min-rettindi')
    cy.findByRole('region', { name: 'Mín réttindi' }).should('exist')
    cy.findByRole('text leaf', { name: fakeUsers[2].name }).should('exist')
    cy.findByRole('text leaf', { name: 'UFZ3P1Z1' }).should('exist')
    cy.findByRole('pushbutton', { name: 'Afrita kóða' }).should('exist')
  })
})

const phoneNumber = Cypress.env('PHONE_NUMBER')

describe('Home page', () => {

  it('should navigate serviceportal', () => {
    cy.visit('/minarsidur/')

    cy.idsLogin({ phoneNumber: phoneNumber })
  })
})

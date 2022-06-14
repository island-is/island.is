const phoneNumber = Cypress.env('PHONE_NUMBER')

describe('minarsidur', () => {
  // NOTE: not needed for local testing, review when in pipelines
  // beforeEach(() => {
  //   cy.login({
  //     cognitoUsername: Cypress.env('COGNITO_USERNAME') ?? '',
  //     cognitoPassword: Cypress.env('COGNITO_PASSWORD') ?? '',
  //   })
  // })

  it('test minarsidur', function () {
    cy.visit('/minarsidur/')

    cy.idsLogin({ phoneNumber: phoneNumber })
  })
})

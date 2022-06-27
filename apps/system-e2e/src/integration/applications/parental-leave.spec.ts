describe('Parental leave', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')
  const testEnvironment: TestEnvironment = Cypress.env('testEnvironment')
  const { authUrl }: Pick<TestConfig, 'authUrl'> = Cypress.env(testEnvironment)

  beforeEach(() => {
    cy.log('fakeUsers', fakeUsers)
    cy.log('authUrl', authUrl)
    cy.log('testEnvironment', testEnvironment)
    cy.idsLogin({
      phoneNumber: fakeUsers[0].phoneNumber,
      url: '/umsoknir/faedingarorlof',
    })
  })

  it('should navigate serviceportal', () => {
    cy.visit('/umsoknir/faedingarorlof')

    cy.get('body').then((body) => {
      const newAppButton = body.find("[data-testid='create-new-application']")
      if (newAppButton.length > 0) {
        newAppButton.click()
      }
    })
    cy.get("[data-testid='mockdata-no']").click()
    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='agree-to-data-providers']").click()
    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='child-0']").click()
    cy.get('[data-testid="select-child"]').click()
    cy.get("[data-testid='email']").click().type('{selectall}noreply@island.is')
    cy.get('[data-testid="phone"]').click().type('{selectall}5555555')
    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='other-parent']").click()
    cy.get('[data-testid="other-parent-name"]')
      .click()
      .type('{selectall}Gervimaður Afríka')
    cy.get('[data-testid="other-parent-kennitala"]')
      .click()
      .type('{selectall}0101303019')
    cy.get('[data-testid="proceed"]').click()

    cy.get('[data-testid="yes-option"]').click()
    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='bank-account-number']").type(
      '{selectall}051226054678',
    )
    cy.get("[data-testid='pension-fund']").focus().type('{downArrow}')
    cy.get('#react-select-payments\\.pensionFund-option-0').click()
    cy.get("[data-testid='use-union']").click()
    cy.get("[data-testid='payments-union']").focus().type('{downArrow}')
    cy.get('#react-select-payments\\.union-option-0').click()
    cy.get("[data-testid='use-private-pension-fund']").click()
    cy.get("[data-testid='private-pension-fund']").focus().type('{downArrow}')
    cy.get('#react-select-payments\\.privatePensionFund-option-0').click()
    cy.get("[data-testid='private-pension-fund-ratio']")
      .focus()
      .type('{downArrow}')
    cy.get(
      '#react-select-payments\\.privatePensionFundPercentage-option-0',
    ).click()
    cy.get('[data-testid="proceed"]').click()
  })
})

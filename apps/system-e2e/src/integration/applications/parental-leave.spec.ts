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
  })
})

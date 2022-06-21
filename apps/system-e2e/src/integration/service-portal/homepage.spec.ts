describe('Home page', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')
  const testEnvironment: TestEnvironment = Cypress.env('testEnvironment')
  const { authUrl }: Pick<TestConfig, 'authUrl'> = Cypress.env(testEnvironment)

  beforeEach(() => {
    cy.log('fakeUsers', fakeUsers)
    cy.log('authUrl', authUrl)
    cy.log('testEnvironment', testEnvironment)
    cy.idsLogin({
      phoneNumber: fakeUsers['María'].phoneNumber,
      authDomain: `https://${authDomain}`,
    })
    cy.contains('Pósthólf')
    cy.contains(fakeUsers['María'].name)
  })
})

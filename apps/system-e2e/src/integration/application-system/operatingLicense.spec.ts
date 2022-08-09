import { regex as uuidRegex } from 'uuidv4'

describe('Operating Licenses', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')
  const testEnvironment: TestEnvironment = Cypress.env('testEnvironment')
  const { authUrl }: Pick<TestConfig, 'authUrl'> = Cypress.env(testEnvironment)
  const applicationPath = '/umsoknir/rekstrarleyfi'

  const invalidNames = ['!@#$%^&*(){}', '', 'a'.repeat(1000)]
  const invalidVsk = ['-', 'abc', 'abc123', '', '9'.repeat(100), '123']

  const assertValueIsMissingInField = (value: string, field: string) => {
    cy.get(field).should('not.contain', value)
  }
  const assertInvalidValues = () => {
    cy.url().as('pre-click')
    cy.get('[type="submit"]').click()
    cy.get('[id$=-error').should('not.exist')
    cy.get('@pre-click').then((pre_url) => {
      cy.url().should('eq', pre_url)
    })
  }

  before(() => {
    cy.idsLogin({
      phoneNumber: fakeUsers[0].phoneNumber,
      url: applicationPath,
    })
  })

  it('should be able to create application', () => {
    cy.visit('/minarsidur/')
    cy.get('input[name="approveExternalData"]').click()
    cy.get('input[type="submit"]').click()
    cy.visit(applicationPath)
    // Check open application list is non-empty
    cy.contains('Þínar umsóknir').next().should('have.length.greaterThan', 0)
  })

  it('should be able to continue application', () => {
    cy.get('button').contains('Opna umsókn').click()
    cy.url().should('match', new RegExp(`${applicationPath}/${uuidRegex}$`))
  })

  it('should not be able to insert invalid values', () => {
    cy.get('input[name="info.operationName"]').as('nameField')
    cy.get('input[name="info.vskNr"]').as('nameField')
    cy.get('button[type="submit"]').as('continue')

    // Invalid fields
    invalidNames.forEach((name) => {
      cy.get('@nameField').clear().type(name)
      assertInvalidValues()
    })
    cy.get('@nameField').clear().type('nameofoperation')
    invalidVsk.forEach((vsk) => {
      cy.get('@vskField').clear().type(vsk)
      cy.get('@vskField').should('not.contain', vsk)
    })
    // Some VSK values are correct when typed because the invalid characters are not registered
    assertInvalidValues()
    cy.get('@vskField').clear().type('9'.repeat(7))

    // TODO: Same, but for email and phone
  })

  // TODO: more steps, at least one completion of both accomodation and service
})

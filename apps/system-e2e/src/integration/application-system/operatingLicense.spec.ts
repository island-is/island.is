import { regex as uuidRegex } from 'uuidv4'

describe('Operating Licenses', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers')
  const testEnvironment: TestEnvironment = Cypress.env('testEnvironment')
  const { authUrl }: Pick<TestConfig, 'authUrl'> = Cypress.env(testEnvironment)
  const applicationPath = '/umsoknir/rekstrarleyfi'

  const assertValueIsMissingInField = (value: string, field: string) => {
    cy.get(field).should('not.contain', value)
  }
  const assertInvalidValues = (field: string, expected: string) => {}

  before(() => {
    cy.idsLogin({
      phoneNumber: fakeUsers[0].phoneNumber,
      url: applicationPath,
    })
  })

  it('should be able to create application', () => {
    cy.visit(applicationPath)
    cy.get('input[name="approveExternalData"]').click()
    cy.get('input[type="submit"]').click()
    cy.url().as('firstApplication')
    cy.visit(applicationPath)
    // Check open application list is non-empty
    cy.contains('Þínar umsóknir').next().should('have.length.greaterThan', 0)
  })

  it('should be able to continue application', () => {
    cy.get('button').first().contains('Opna umsókn').click()
    cy.get('@firstApplication').then((url) => {
      cy.url().should('eq', url)
    })
  })

  it('should be able to create accomodation without food or alchohol', () => {
    cy.get('input[value="hotel"]').click()
    cy.get('label[for="applicationInfo.hotel.type"]').click()
    cy.type('heima{enter}')
    cy.get('button[type="submit"]').click()
  })

  it('should not be able to insert invalid values at information screen', () => {
    cy.get('input[name="info.operationName"]').as('nameField')
    cy.get('input[name="info.vskNr"]').as('vskField')
    cy.get('input[name="info.email"]').as('emailField')
    cy.get('input[name="info.phone"]').as('phoneField')

    // Lists of invalid values, last value should be valid
    const invalidValues: Record<string, string[]> = {
      name: ['!@#$%^&*(){}', '', 'a'.repeat(1000), 'coolName'],
      vsk: ['-', 'abc', 'abc123', '', '9'.repeat(100), '123', '123456'],
    }

    // Test inputting invalid information
    for (const field of Object.keys(invalidValues)) {
      const invalids = invalidValues[field]
      const valid = invalids.pop()! // Remove trailing valid value
      const alias = `@${field}Field`

      // Try all invalid values
      for (const value of invalids) {
        cy.get(alias).clear().type(value)
        cy.get('form').click() // Release focus
        // Verify the inputted value is invalid
        // That is, throw an error if there is no error
        cy.get('[id$=-error]').then((el) => {
          // On invalid input there should be an error message (el.length > 0)
          // or the inputted value has been truncated, no longer matching the original value
          if (el.length == 0) cy.get(field).should('not.have.value', value)
          /* else: there is an error message */
        })
      }
      // Leave valid input for following fields
      cy.get(alias).clear().type(valid)
    }
    cy.get('button[type="submit"]').click()

    /*
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
    */
  })

  // TODO: more steps, at least one completion of both accomodation and service
})

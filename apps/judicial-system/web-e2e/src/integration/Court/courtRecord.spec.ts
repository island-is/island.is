import { makeCase } from '../../fixtures/testDataFactory'
import { intercept } from '../../utils'

describe('/domur/thingbok/:id', () => {
  beforeEach(() => {
    const caseData = makeCase()

    cy.stubAPIResponses()
    cy.visit('/domur/thingbok/test_id_stadfest')

    intercept(caseData)
  })

  it('should autofill court attendees', () => {
    cy.getByTestid('courtAttendees').contains(
      'Áki Ákærandi aðstoðarsaksóknari Donald Duck kærði',
    )
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('courtStartDate-time').type('1222')
    cy.getByTestid('courtLocation').type('í Dúfnahólum 10')
    cy.getByTestid('litigationPresentations').type('lorem')
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/urskurdur/test_id_stadfest')
  })
})

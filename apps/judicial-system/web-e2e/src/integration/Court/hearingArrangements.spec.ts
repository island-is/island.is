import { Case, CaseState } from '@island.is/judicial-system/types'
import { makeCase, makeCourt } from '../../fixtures/testDataFactory'
import { intercept } from '../../utils'

describe('/domur/krafa/fyrirtokutimi/:id', () => {
  beforeEach(() => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.stubAPIResponses()
    cy.visit('/domur/fyrirtokutimi/test_id_stadfest')

    intercept(caseDataAddition)
  })

  it('should allow users to choose if they send COURT_DATE notification', () => {
    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('select-registrar').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modal').should('be.visible')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('select-registrar').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', '/domur/thingbok/test_id_stadfest')
  })
})

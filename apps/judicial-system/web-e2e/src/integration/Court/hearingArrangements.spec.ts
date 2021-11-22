import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import { makeCase, makeCourt } from '@island.is/judicial-system/formatters'
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

    intercept(caseDataAddition)
  })

  it('should allow users to choose if they send COURT_DATE notification', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.visit('/domur/fyrirtokutimi/test_id_stadfest')
    intercept(caseDataAddition)

    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('select-registrar').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.getByTestid('courtroom').type('1337')
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modal').should('be.visible')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      requestedCourtDate: '2020-09-16T19:50:08.033Z',
      state: CaseState.RECEIVED,
    }

    cy.visit('/domur/fyrirtokutimi/test_id_stadfest')
    intercept(caseDataAddition)

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

  it.skip('should hide the next button and show a info panel instead if the case is an investigation case and the current user does not have access to continue', () => {
    const caseData = makeCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      state: CaseState.RECEIVED,
      type: CaseType.INTERNET_USAGE,
      isMasked: true,
    }

    cy.visit('/domur/rannsoknarheimild/fyrirtaka/test_id_stadfest')
    intercept(caseDataAddition)

    cy.getByTestid('infobox').should('exist')
    cy.getByTestid('continueButton').should('not.exist')
  })
})

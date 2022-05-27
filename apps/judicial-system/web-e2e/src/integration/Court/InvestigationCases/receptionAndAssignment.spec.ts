import { CaseState } from '@island.is/judicial-system/types'
import {
  IC_OVERVIEW_ROUTE,
  IC_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeCourt, makeRestrictionCase, intercept } from '../../../utils'

describe(`${IC_RECEPTION_AND_ASSIGNMENT_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = makeRestrictionCase()

    const caseDataAddition = {
      ...caseData,
      state: CaseState.RECEIVED,
      court: makeCourt(),
    }

    cy.login()
    cy.stubAPIResponses()
    cy.visit(`${IC_RECEPTION_AND_ASSIGNMENT_ROUTE}/test`)

    intercept(caseDataAddition)
  })

  it('should enable continue button when required fields are valid', () => {
    // case number validation
    cy.getByTestid('courtCaseNumber').click().blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtCaseNumber').type('R-X/2021')
    cy.getByTestid('inputErrorMessage').should('be.visible')

    // continue button enabled when form becomes valid
    cy.getByTestid('courtCaseNumber').clear().type('R-1/2021')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('continueButton').should('be.enabled')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('courtCaseNumber').type('R-1/2021')
    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()
    cy.getByTestid('select-registrar').click()
    cy.get('#react-select-registrar-option-0').click()
    cy.getByTestid('continueButton').click()
    cy.url().should('include', IC_OVERVIEW_ROUTE)
  })
})

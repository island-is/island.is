import { CaseState, CaseType, UserRole } from '@island.is/judicial-system/types'
import {
  RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
  RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'

import {
  makeCourt,
  intercept,
  hasOperationName,
  Operation,
  makeJudge,
  mockCase,
} from '../../../utils'

describe(`${RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/:id`, () => {
  const caseData = mockCase(CaseType.CUSTODY)
  const caseDataAddition = {
    ...caseData,
    state: CaseState.RECEIVED,
    court: makeCourt(),
  }

  beforeEach(() => {
    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/test`)
  })

  it('should require a valid form', () => {
    cy.intercept('POST', '**/api/graphql', (req) => {
      if (hasOperationName(req, Operation.UpdateCaseMutation)) {
        const { body } = req
        req.reply({
          data: {
            updateCase: {
              ...body.variables?.input,
              judge: makeJudge(),
              __typename: 'Case',
            },
          },
        })
      }
    })

    //
    // case number validation
    cy.getByTestid('courtCaseNumber').click()
    cy.getByTestid('courtCaseNumber').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('courtCaseNumber').type('S-1/2021')
    cy.getByTestid('courtCaseNumber').blur()
    cy.getByTestid('inputErrorMessage').contains(
      `Dæmi: R-1234/${new Date().getFullYear()}`,
    )

    // continue button enabled when form becomes valid
    cy.getByTestid('courtCaseNumber').clear()
    cy.getByTestid('courtCaseNumber').type('R-1/2021')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('select-judge').click()
    cy.get('#react-select-judge-option-0').click()

    cy.getByTestid('continueButton').should('be.enabled')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', RESTRICTION_CASE_COURT_OVERVIEW_ROUTE)
  })
})

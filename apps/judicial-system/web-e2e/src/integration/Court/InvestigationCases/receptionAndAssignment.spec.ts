import { CaseState, UserRole } from '@island.is/judicial-system/types'
import {
  IC_OVERVIEW_ROUTE,
  IC_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'

import {
  makeCourt,
  makeRestrictionCase,
  intercept,
  hasOperationName,
  Operation,
  makeJudge,
} from '../../../utils'

describe(`${IC_RECEPTION_AND_ASSIGNMENT_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = makeRestrictionCase()

    const caseDataAddition = {
      ...caseData,
      state: CaseState.RECEIVED,
      court: makeCourt(),
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${IC_RECEPTION_AND_ASSIGNMENT_ROUTE}/test`)
  })

  it('should enable continue button when required fields are valid', () => {
    cy.intercept('POST', '**/api/graphql', (req) => {
      console.log('intercepting')
      if (hasOperationName(req, Operation.UpdateCaseMutation)) {
        const { body } = req
        console.log('intercepting updatecase', body)
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
    cy.getByTestid('continueButton').click()
    cy.url().should('include', IC_OVERVIEW_ROUTE)
  })
})

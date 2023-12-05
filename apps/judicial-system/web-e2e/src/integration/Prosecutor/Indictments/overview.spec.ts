import {
  CASES_ROUTE,
  INDICTMENTS_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseState, CaseType, UserRole } from '@island.is/judicial-system/types'

import {
  makeCourt,
  mockCase,
  makeProsecutor,
  intercept,
  hasOperationName,
} from '../../../utils'

describe(`${INDICTMENTS_OVERVIEW_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.INDICTMENT)
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      creatingProsecutor: makeProsecutor(),
      court: makeCourt(),
    }

    cy.login(UserRole.PROSECUTOR)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INDICTMENTS_OVERVIEW_ROUTE}/test_id`)
  })

  it('should navigate to the correct page on continue', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalPrimaryButton').click()
    cy.url().should('contain', CASES_ROUTE)
  })
})

describe(`${INDICTMENTS_OVERVIEW_ROUTE}/:id submitted`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.INDICTMENT)
    const caseDataAddition = {
      ...caseData,
      state: CaseState.RECEIVED,
      courtCaseNumber: 'S-test/2023',
      prosecutor: makeProsecutor(),
      creatingProsecutor: makeProsecutor(),
      court: makeCourt(),
    }

    cy.login(UserRole.PROSECUTOR)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INDICTMENTS_OVERVIEW_ROUTE}/test_id`)
  })

  it('should have infobox instead of continue button', () => {
    cy.getByTestid('continueButton').should('not.exist')
    cy.getByTestid('infobox').should('exist')
    cy.intercept('POST', '**/api/graphql', (req) => {
      if (hasOperationName(req, 'CasesQuery')) {
        req.alias = 'gqlCasesQuery'
        req.reply({ fixture: 'cases' })
      }
    })
    cy.getByTestid('previousButton').click()
    cy.url().should('contain', CASES_ROUTE)
  })
})

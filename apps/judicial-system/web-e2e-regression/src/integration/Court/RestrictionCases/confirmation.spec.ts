import {
  RESTRICTION_CASE_CONFIRMATION_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  CaseDecision,
  CaseTransition,
  CaseType,
} from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase, updateCase } from '../../../utils'

describe(RESTRICTION_CASE_CONFIRMATION_ROUTE, () => {
  let caseId = ''

  before(() => {
    cy.intercept('POST', '**/api/graphql', (req) => {
      if (req.body.query.includes('RulingSignatureConfirmation')) {
        req.alias = 'gqlRulingSignatureConfirmationQuery'
        req.reply({ fixture: 'rulingSignatureConfirmationResponse' })
      }
    })

    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101'])
      .then((id) => {
        caseId = id
      })
      .then(() => {
        transitionCase(caseId, CaseTransition.OPEN)
      })
      .then(() => {
        transitionCase(caseId, CaseTransition.SUBMIT)
      })
      .then(() => {
        cy.visit('http://localhost:4200/api/auth/login?nationalId=0000002229')
      })
      .then(() => {
        updateCase(caseId, {
          judgeId: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
          decision: CaseDecision.ACCEPTING,
        })
      })
      .then(() => transitionCase(caseId, CaseTransition.RECEIVE))
      .then(() =>
        cy.visit(
          `http://localhost:4200${RESTRICTION_CASE_CONFIRMATION_ROUTE}/${caseId}`,
        ),
      )
  })

  it('should validate the form', () => {
    cy.getByTestid('continueButton').click()
    cy.wait('@gqlRulingSignatureConfirmationQuery')
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', `${SIGNED_VERDICT_OVERVIEW_ROUTE}/${caseId}`)
  })
})

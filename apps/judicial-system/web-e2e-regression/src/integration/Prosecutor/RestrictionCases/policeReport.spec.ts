import faker from 'faker'

import {
  RESTRICTION_CASE_POLICE_REPORT_ROUTE,
  RESTRICTION_CASE_CASE_FILES_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase } from '../../../utils'

describe(RESTRICTION_CASE_POLICE_REPORT_ROUTE, () => {
  let caseId = ''

  before(() => {
    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101']).then((id) => {
      caseId = id
      cy.visit(
        `http://localhost:4200${RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${id}`,
      )
    })
  })

  after(() => {
    transitionCase(caseId, CaseTransition.DELETE)
  })

  it('should validate the form', () => {
    cy.get('#demands').type(faker.lorem.words(2))
    cy.getByTestid('continueButton').should('be.disabled')

    cy.get('#caseFacts').type(faker.lorem.words(2))
    cy.getByTestid('continueButton').should('be.disabled')

    cy.get('#legalArguments').type(faker.lorem.words(2))

    cy.getByTestid('continueButton').click()
    cy.url().should('contain', RESTRICTION_CASE_CASE_FILES_ROUTE)
  })
})

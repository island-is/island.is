import faker from 'faker'

import {
  RESTRICTION_CASE_POLICE_REPORT_ROUTE,
  RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase } from '../../../utils'

describe(RESTRICTION_CASE_POLICE_DEMANDS_ROUTE, () => {
  let caseId = ''

  before(() => {
    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101']).then((id) => {
      caseId = id
      cy.visit(
        `http://localhost:4200${RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${id}`,
      )
    })
  })

  after(() => {
    transitionCase(caseId, CaseTransition.DELETE)
  })

  it('should validate the form', () => {
    cy.get('#reqValidToDate').type('2020-10-10')
    cy.get('#reqValidToDate').type('{enter}')
    cy.get('#reqValidToDate-time').type('10:10')
    cy.getByTestid('continueButton').should('be.disabled')

    cy.getByTestid('lawsBroken').type(faker.lorem.words(2))
    cy.getByTestid('continueButton').should('be.disabled')

    cy.get('[value="_95_1_B"]').check()

    cy.getByTestid('continueButton').click()
    cy.url().should('contain', RESTRICTION_CASE_POLICE_REPORT_ROUTE)
  })
})

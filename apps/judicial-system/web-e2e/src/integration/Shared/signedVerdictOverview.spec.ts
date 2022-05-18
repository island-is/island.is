import {
  MODIFY_RULING_ROUTE,
  SIGNED_VERDICT_OVERVIEW,
} from '@island.is/judicial-system/consts'
import { Case, UserRole } from '@island.is/judicial-system/types'

import {
  intercept,
  makeCourt,
  makeCustodyCase,
  makeProsecutor,
} from '../../utils'

describe('Signed verdict overview for prosecutors', () => {
  beforeEach(() => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
    }

    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  it('should not have a button for amending the ruling', () => {
    cy.get('[data-testid="amendRulingButton"]').should('not.exist')
  })
})

describe('Signed verdict overview for court users', () => {
  beforeEach(() => {
    const caseData = makeCustodyCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  it('should have a button for amending the ruling that navigates to a amend ruling page', () => {
    cy.get('[data-testid="amendRulingButton"]').should('exist').click()
    cy.url().should('include', MODIFY_RULING_ROUTE)
  })
})

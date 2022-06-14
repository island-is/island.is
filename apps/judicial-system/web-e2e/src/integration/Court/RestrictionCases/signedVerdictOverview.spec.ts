import {
  MODIFY_RULING_ROUTE,
  SIGNED_VERDICT_OVERVIEW,
} from '@island.is/judicial-system/consts'
import { Case, CaseState, UserRole } from '@island.is/judicial-system/types'

import { intercept, makeCourt, makeRestrictionCase } from '../../../utils'

describe('Signed verdict overview - Court - Restriction cases', () => {
  beforeEach(() => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  // TODO: The button is currently under feature flag. Remove .skip() when feature flag is removed.
  it.skip('should have a button for modifying the ruling that navigates to a modify ruling page', () => {
    cy.get('[data-testid="modifyRulingButton"]').should('exist').click()
    cy.url().should('include', MODIFY_RULING_ROUTE)
  })
})

describe('Modify valid to date', () => {
  beforeEach(() => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      state: CaseState.ACCEPTED,
      isValidToDateInThePast: false,
      validToDate: '2022-06-13T19:51:39.466Z',
      isolationToDate: '2022-06-13T19:51:39.466Z',
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    cy.visit(`${SIGNED_VERDICT_OVERVIEW}/test_id`)
    intercept(caseDataAddition)
  })

  it('should be able to extend custody valid to date', () => {
    cy.getByTestid('caseDates').find('[type="button"]').click()

    cy.getByTestid('modalPrimaryButton').should('be.disabled')
    cy.getByTestid('modal').get('[name="reason"]').focus().blur()
    cy.get('[data-testid=inputErrorMessage]').contains(
      'Reitur má ekki vera tómur',
    )
    cy.getByTestid('modal').get('[name="reason"]').type('lorem')
    cy.get('[data-testid=inputErrorMessage]').should('not.exist')
    cy.getByTestid('datepicker').first().click()
    cy.getByTestid('datepickerIncreaseMonth').click()
    cy.contains('15').click()

    cy.getByTestid('modifiedValidToDate-time').clear().blur()
    cy.getByTestid('modalPrimaryButton').should('be.disabled')
    cy.get('[data-testid=inputErrorMessage]').contains(
      'Reitur má ekki vera tómur',
    )
    cy.getByTestid('modifiedValidToDate-time').type('1333')

    cy.getByTestid('modalPrimaryButton').click()

    cy.getByTestid('dateModifyingModalSuccess')
    cy.getByTestid('modalSecondaryButton').click()
    cy.getByTestid('alertMessage')
  })
})

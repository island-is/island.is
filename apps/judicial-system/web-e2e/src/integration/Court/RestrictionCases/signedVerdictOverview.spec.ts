import { SIGNED_VERDICT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  Case,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import { intercept, makeCourt, makeJudge, mockCase } from '../../../utils'

describe('Signed verdict overview - Court - Accepted restriction cases', () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.CUSTODY)
    const caseDataAddition: Case = {
      ...caseData,
      court: makeCourt(),
      state: CaseState.ACCEPTED,
      isValidToDateInThePast: false,
      validToDate: '2022-06-13T19:51:39.466Z',
      isolationToDate: '2022-06-13T19:51:39.466Z',
      judge: makeJudge(),
    }

    cy.login(UserRole.DISTRICT_COURT_JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${SIGNED_VERDICT_OVERVIEW_ROUTE}/test_id`)
  })

  it('should display appropriate components on page', () => {
    cy.get('[aria-controls="caseFilesAccordionItem"]')
  })

  it('should be able to extend custody valid to date', () => {
    cy.getByTestid('caseDates').find('[type="button"]').click()

    cy.getByTestid('modalPrimaryButton').should('be.disabled')
    cy.getByTestid('modal').get('[name="reason"]').focus()
    cy.getByTestid('modal').get('[name="reason"]').blur()
    cy.get('[data-testid=inputErrorMessage]').contains(
      'Reitur má ekki vera tómur',
    )
    cy.getByTestid('modal').get('[name="reason"]').type('lorem')
    cy.get('[data-testid=inputErrorMessage]').should('not.exist')
    cy.getByTestid('datepicker').first().click()
    cy.getByTestid('datepickerIncreaseMonth').click()
    cy.get('.react-datepicker-popper').contains('15').click()

    cy.getByTestid('modifiedValidToDate-time').clear()
    cy.getByTestid('modifiedValidToDate-time').blur()
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

  it('should not be able to sign the court record', () => {
    cy.get('[data-testid="signCourtRecordButton"]').should('not.exist')
  })
})

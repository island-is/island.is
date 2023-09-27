import {
  RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
  RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
} from '@island.is/judicial-system/consts'
import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'

import {
  makeCourt,
  makeProsecutor,
  intercept,
  Operation,
  mockCase,
} from '../../../utils'

describe(`${RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/:id`, () => {
  const caseData = mockCase(CaseType.CUSTODY)
  const caseDataAddition: Case = {
    ...caseData,
    prosecutor: makeProsecutor(),
    court: makeCourt(),
    state: CaseState.RECEIVED,
  }

  describe('Happy path', () => {
    beforeEach(() => {
      cy.stubAPIResponses()
      intercept(caseDataAddition)
      cy.visit(`${RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/test_id`)
    })

    it('should validate input', () => {
      // should require a valid arrest time
      cy.getByTestid('datepicker').first().type('01.01.2020')
      cy.clickOutside()
      cy.getByTestid('arrestDate-time').type('13:')
      cy.getByTestid('arrestDate-time').blur()
      cy.getByTestid('inputErrorMessage').contains('Dæmi: 12:34 eða 1:23')
      cy.getByTestid('arrestDate-time').clear()
      cy.getByTestid('arrestDate-time').blur()
      cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
      cy.getByTestid('arrestDate-time').clear()
      cy.getByTestid('arrestDate-time').type('1333')
      cy.getByTestid('inputErrorMessage').should('not.exist')

      // should have an info bubble that explains what the requested court date means
      cy.getByTestid('requested-court-date-tooltip').trigger('mouseover')
      cy.contains(
        'Dómstóll hefur þennan tíma til hliðsjónar þegar fyrirtökutíma er úthlutað og mun leitast við að taka málið fyrir í tæka tíð en ekki fyrir þennan tíma.',
      )
      // should require a valid requested court date time
      cy.getByTestid('datepicker').last().click()
      cy.getByTestid('datepickerIncreaseMonth').dblclick()
      cy.contains('15').click()
      cy.getByTestid('reqCourtDate-time').type('13:')
      cy.getByTestid('reqCourtDate-time').blur()
      cy.getByTestid('inputErrorMessage').contains('Dæmi: 12:34 eða 1:23')
      cy.getByTestid('reqCourtDate-time').clear()
      cy.getByTestid('reqCourtDate-time').blur()
      cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
      cy.getByTestid('reqCourtDate-time').clear()
      cy.getByTestid('reqCourtDate-time').type('1333')
      cy.getByTestid('inputErrorMessage').should('not.exist')
    })

    it('should display information about case', () => {
      // should set the default prosecutor as the user who created the case
      cy.getByTestid('select-prosecutor').contains('Áki Ákærandi')

      // should have a info bubble that explains the what setting a prosecutor does
      cy.getByTestid('prosecutor-tooltip').trigger('mouseover')
      cy.contains(
        'Sá ákærandi sem valinn er hér er skráður fyrir kröfunni í öllum upplýsingaskeytum og skjölum sem tengjast kröfunni, og flytur málið fyrir dómstólum fyrir hönd síns embættis.',
      )

      // should set the default court as Héraðsdómur Reykjavíkur when a case is created
      cy.getByTestid('select-court').contains('Héraðsdómur Reykjavíkur')
    })

    it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
      cy.getByTestid('datepicker').first().type('01.01.2020')
      cy.clickOutside()
      cy.getByTestid('arrestDate-time').clear()
      cy.getByTestid('arrestDate-time').type('1333')
      cy.getByTestid('datepicker').last().click()
      cy.getByTestid('datepickerIncreaseMonth').dblclick()
      cy.contains('15').click()
      cy.getByTestid('reqCourtDate-time').clear()
      cy.getByTestid('reqCourtDate-time').type('1333')
      cy.getByTestid('continueButton').click()
      cy.url().should('include', RESTRICTION_CASE_POLICE_DEMANDS_ROUTE)
    })
  })

  describe('Sending notification fails', () => {
    beforeEach(() => {
      const shouldFail = Operation.SendNotificationMutation
      cy.stubAPIResponses()
      intercept({ ...caseDataAddition, state: CaseState.DRAFT }, shouldFail)
      cy.visit(`${RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/test_id`)
    })

    it('should show an error message', () => {
      cy.getByTestid('datepicker').first().type('01.01.2020')
      cy.clickOutside()
      cy.getByTestid('arrestDate-time').clear()
      cy.getByTestid('arrestDate-time').type('1333')
      cy.getByTestid('datepicker').last().click()
      cy.getByTestid('datepickerIncreaseMonth').dblclick()
      cy.contains('15').click()
      cy.getByTestid('reqCourtDate-time').clear()
      cy.getByTestid('reqCourtDate-time').type('1333')
      cy.getByTestid('continueButton').click()
      cy.getByTestid('modalPrimaryButton').click()
      cy.getByTestid('modalErrorMessage').should('exist')
    })
  })
})

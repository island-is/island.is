import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import {
  RESTRICTION_CASE_CONFIRMATION_ROUTE,
  RESTRICTION_CASE_COURT_RECORD_ROUTE,
} from '@island.is/judicial-system/consts'

import { makeProsecutor, intercept, mockCase } from '../../../utils'

describe(`${RESTRICTION_CASE_COURT_RECORD_ROUTE}/:id`, () => {
  const caseData = mockCase(CaseType.CUSTODY)
  const caseDataAddition: Case = {
    ...caseData,
    prosecutor: makeProsecutor(),
  }

  describe('Restriction cases', () => {
    describe('Cases with accepting decision', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        intercept({ ...caseDataAddition, decision: CaseDecision.ACCEPTING })
        cy.visit(`${RESTRICTION_CASE_COURT_RECORD_ROUTE}/test_id_stadfest`)
      })

      it('should autofill relevant fields', () => {
        cy.getByTestid('courtAttendees').contains(
          `Áki Ákærandi aðstoðarsaksóknari ${
            caseData.defendants && caseData.defendants[0].name
          } varnaraðili`,
        )
        cy.getByTestid('sessionBookings').should('not.match', ':empty')
        cy.getByTestid('endOfSessionBookings').should('not.match', ':empty')
      })
    })

    describe('Validation', () => {
      /**
       * The previous step has the conclusion, ruling and decision fields. Users
       * should not be able to continue of this step if any of them are empty.
       */
      const shouldNotAllowUsersToContinue = () =>
        it('should not allow users to continue', () => {
          cy.getByTestid('formFooter')
            .children()
            .getByTestid('infobox')
            .should('exist')
        })

      beforeEach(() => {
        cy.stubAPIResponses()
      })

      describe('Happy path', () => {
        beforeEach(() => {
          intercept({
            ...caseDataAddition,
            courtDate: '2021-12-16T10:50:04.033Z',
            decision: CaseDecision.ACCEPTING,
            ruling: 'lorem',
            conclusion: 'lorem',
          })
          cy.visit(`${RESTRICTION_CASE_COURT_RECORD_ROUTE}/test_id_stadfest`)
        })

        it.skip('should validate the form', () => {
          cy.getByTestid('continueButton').should('be.disabled')
          cy.getByTestid('courtLocation').type('í Dúfnahólum 10')
          cy.getByTestid('sessionBookings').type('lorem')
          cy.get('#prosecutor-appeal').check()
          cy.get('#accused-appeal').check()
          cy.getByTestid('datepicker').last().type('17.12.2021')
          cy.clickOutside()
          cy.getByTestid('courtEndTime-time').clear()
          cy.getByTestid('courtEndTime-time').blur()
          cy.get('#courtEndTime-time-error').should('exist')
          cy.getByTestid('courtEndTime-time').type('11:00')
          cy.get('#courtEndTime-time-error').should('not.exist')
          cy.getByTestid('continueButton').should('not.be.disabled')
          cy.getByTestid('continueButton').click()
          cy.url().should(
            'include',
            `${RESTRICTION_CASE_CONFIRMATION_ROUTE}/test_id_stadfest`,
          )
        })

        describe('Autofill appeal announcement when defendant appeals in court', () => {
          it('should autofill appeal announcement when defendant appeals', () => {
            cy.get('#accused-appeal').check()
            cy.getByTestid('accusedAppealAnnouncement').should('not.be.empty')
          })

          it('should clear appeal announcement when something else besides APPEAL option is selected', () => {
            cy.get('#accused-appeal').check()
            cy.getByTestid('accusedAppealAnnouncement').should('not.be.empty')
            cy.get('#accused-postpone').check()
            cy.getByTestid('accusedAppealAnnouncement').should('be.empty')
          })
        })

        describe('Autofill appeal announcement when prosecutor appeals in court', () => {
          it('should autofill appeal announcement when prosecutor appeals', () => {
            cy.get('#prosecutor-appeal').check()
            cy.getByTestid('prosecutorAppealAnnouncement').should(
              'not.be.empty',
            )
          })

          it('should clear appeal announcement when something else besides APPEAL option is selected', () => {
            cy.get('#prosecutor-appeal').check()
            cy.getByTestid('prosecutorAppealAnnouncement').should(
              'not.be.empty',
            )
            cy.get('#prosecutor-postpone').check()
            cy.getByTestid('prosecutorAppealAnnouncement').should('be.empty')
          })
        })

        describe('Conclusion is empty', () => {
          beforeEach(() => {
            intercept({
              ...caseDataAddition,
              decision: CaseDecision.ACCEPTING,
              ruling: 'lorem',
              conclusion: undefined,
            })
            cy.visit(`${RESTRICTION_CASE_COURT_RECORD_ROUTE}/test_id_stadfest`)
          })

          shouldNotAllowUsersToContinue()
        })

        describe('Ruling is empty', () => {
          beforeEach(() => {
            intercept({
              ...caseDataAddition,
              decision: CaseDecision.ACCEPTING,
              ruling: undefined,
              conclusion: 'lorem',
            })
            cy.visit(`${RESTRICTION_CASE_COURT_RECORD_ROUTE}/test_id_stadfest`)
          })

          shouldNotAllowUsersToContinue()
        })

        describe('Decision is empty', () => {
          beforeEach(() => {
            intercept({
              ...caseDataAddition,
              decision: undefined,
              ruling: 'lorem',
              conclusion: 'lorem',
            })
            cy.visit(`${RESTRICTION_CASE_COURT_RECORD_ROUTE}/test_id_stadfest`)
          })

          shouldNotAllowUsersToContinue()
        })
      })
    })

    describe('Travel ban cases', () => {
      describe('Cases with accepting decision', () => {
        beforeEach(() => {
          cy.stubAPIResponses()
          intercept({
            ...caseDataAddition,
            decision: CaseDecision.ACCEPTING,
            type: CaseType.TRAVEL_BAN,
            requestedOtherRestrictions: 'other restrictions',
          })
          cy.visit(`${RESTRICTION_CASE_COURT_RECORD_ROUTE}/test_id_stadfest`)
        })

        it('should autofill relevant fields', () => {
          cy.getByTestid('sessionBookings').should('not.match', ':empty')
          cy.getByTestid('endOfSessionBookings').contains('other restrictions')
        })
      })
    })
  })
})

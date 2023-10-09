import {
  RESTRICTION_CASE_POLICE_REPORT_ROUTE,
  RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseType } from '@island.is/judicial-system/types'

import { intercept, mockCase } from '../../../utils'

describe(`${RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/:id`, () => {
  const interceptByType = (type: CaseType) => {
    const caseData = mockCase(CaseType.CUSTODY)

    cy.stubAPIResponses()
    intercept({ ...caseData, type })
    cy.visit(`${RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/test_id`)
  }

  describe('Custody cases', () => {
    beforeEach(() => {
      interceptByType(CaseType.CUSTODY)
    })

    it('should validate form', () => {
      cy.getByTestid('continueButton').should('be.disabled')

      cy.getByTestid('datepicker').click()
      cy.getByTestid('datepickerIncreaseMonth').click()
      cy.contains('15').click()
      cy.getByTestid('reqValidToDate-time').type('13:')
      cy.getByTestid('reqValidToDate-time').blur()
      cy.getByTestid('inputErrorMessage').contains('Dæmi: 12:34 eða 1:23')
      cy.getByTestid('reqValidToDate-time').clear()
      cy.getByTestid('reqValidToDate-time').blur()
      cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
      cy.getByTestid('reqValidToDate-time').clear()
      cy.getByTestid('reqValidToDate-time').type('1333')
      cy.getByTestid('inputErrorMessage').should('not.exist')

      cy.getByTestid('continueButton').should('be.disabled')
      cy.getByTestid('lawsBroken').click()
      cy.getByTestid('lawsBroken').blur()
      cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
      cy.getByTestid('lawsBroken').type('Lorem ipsum')
      cy.getByTestid('inputErrorMessage').should('not.exist')

      cy.getByTestid('continueButton').should('be.disabled')
      cy.getByTestid('checkbox').first().click()
      cy.getByTestid('continueButton').should('not.be.disabled')
      cy.getByTestid('checkbox').first().click()
      cy.getByTestid('continueButton').should('be.disabled')
      cy.getByTestid('legalBasis').type('Lorem ipsum')

      cy.getByTestid('continueButton').should('not.be.disabled')
    })

    it('should overwrite demands when requested valid date is updated', () => {
      cy.getByTestid('datepicker').click()
      cy.getByTestid('datepickerIncreaseMonth').click()
      cy.contains('15').click()

      cy.getByTestid('reqValidToDate-time').clear()
      cy.getByTestid('reqValidToDate-time').type('1333')
      cy.wait('@UpdateCaseMutation')
        .its('response.body.data.updateCase')
        .should('have.any.key', 'demands')
    })

    it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
      cy.getByTestid('datepicker').click()
      cy.getByTestid('datepickerIncreaseMonth').click()
      cy.contains('15').click()
      cy.getByTestid('reqValidToDate-time').clear()
      cy.getByTestid('reqValidToDate-time').type('1333')
      cy.getByTestid('lawsBroken').type('Lorem ipsum')
      cy.getByTestid('checkbox').first().click()
      cy.getByTestid('continueButton').click()
      cy.url().should('include', RESTRICTION_CASE_POLICE_REPORT_ROUTE)
    })

    it('should show custody restrictions', () => {
      cy.getByTestid('custodyRestrictions').should('exist')
    })
  })

  describe('Admission to facility', () => {
    beforeEach(() => {
      interceptByType(CaseType.ADMISSION_TO_FACILITY)
    })

    it('should show custody restrictions', () => {
      cy.getByTestid('custodyRestrictions').should('exist')
    })
  })

  describe('Travel ban', () => {
    beforeEach(() => {
      interceptByType(CaseType.TRAVEL_BAN)
    })

    it('should show travel ban restrictions', () => {
      cy.getByTestid('travelBanRestrictions').should('exist')
    })
  })
})

import { Case, CaseDecision, CaseType } from '@island.is/judicial-system/types'
import {
  INVESTIGATION_CASE_MODIFY_RULING_ROUTE,
  SIGNED_VERDICT_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'

import { intercept, mockCase } from '../../../utils'

describe(`${INVESTIGATION_CASE_MODIFY_RULING_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.INTERNET_USAGE)
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
      decision: CaseDecision.ACCEPTING,
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INVESTIGATION_CASE_MODIFY_RULING_ROUTE}/test_id_stadfest`)
  })

  it('should have an alert message', () => {
    cy.getByTestid('alertMessageModifyingRuling').should('exist')
  })

  it('should not allow changes to certain inputs', () => {
    cy.get('#case-decision-accepting-partially').should('be.disabled')
    cy.get('#case-decision-rejecting').should('be.disabled')
    cy.get('#case-decision-accepting').should('be.disabled')
    cy.get('#case-decision-dismissing').should('be.disabled')
    cy.get('[name="conclusion"]').should('be.disabled')
  })

  it('should display a modal when continue button is clicked and routes to the signed verdict overview page', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modal').should('exist')
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('include', SIGNED_VERDICT_OVERVIEW_ROUTE)
  })
})

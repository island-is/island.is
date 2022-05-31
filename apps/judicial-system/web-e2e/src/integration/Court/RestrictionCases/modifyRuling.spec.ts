import { Case, CaseDecision } from '@island.is/judicial-system/types'
import {
  MODIFY_RULING_ROUTE,
  SIGNED_VERDICT_OVERVIEW,
} from '@island.is/judicial-system/consts'

import { makeRestrictionCase, intercept } from '../../../utils'

describe(`${MODIFY_RULING_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should not allow changes to certain inputs', () => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
      decision: CaseDecision.ACCEPTING,
      isCustodyIsolation: true,
    }
    cy.visit(`${MODIFY_RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)
    cy.get('#case-decision-accepting-partially').should('be.disabled')
    cy.get('#case-decision-rejecting').should('be.disabled')
    cy.get('#case-decision-accepting').should('be.disabled')
    cy.get('#case-decision-dismissing').should('be.disabled')
    cy.get('[name="conclusion"]').should('be.disabled')
    cy.get('#validToDate').should('be.disabled')
    cy.get('#validToDate-time').should('be.disabled')
    cy.get('#isolationToDate').should('be.disabled')
    cy.get('#isolationToDate-time').should('be.disabled')
  })

  it('should display a modal when continue button is clicked and routes to the signed verdict overview page', () => {
    const caseData = makeRestrictionCase()
    const caseDataAddition: Case = {
      ...caseData,
      caseFacts: 'lorem ipsum',
      legalArguments: 'lorem ipsum',
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }

    cy.visit(`${MODIFY_RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.getByTestid('continueButton').click()

    cy.getByTestid('modal').should('exist')

    cy.getByTestid('modalSecondaryButton').click()

    cy.url().should('include', SIGNED_VERDICT_OVERVIEW)
  })
})

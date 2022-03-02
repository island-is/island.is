import { Case, CaseDecision } from '@island.is/judicial-system/types'
import {
  makeCustodyCase,
  makeProsecutor,
} from '@island.is/judicial-system/formatters'
import {
  COURT_RECORD_ROUTE,
  RULING_ROUTE,
} from '@island.is/judicial-system/consts'

import { intercept } from '../../../utils'

describe(`${COURT_RECORD_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = makeCustodyCase()

    const caseDataAddition: Case = {
      ...caseData,
      prosecutor: makeProsecutor(),
      courtDate: '2021-12-16T10:50:04.033Z',
      decision: CaseDecision.ACCEPTING,
      demands:
        'Þess er krafist að Donald Duck, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    }

    cy.stubAPIResponses()
    cy.visit(`${COURT_RECORD_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)
  })

  it('should autofill court attendees', () => {
    cy.getByTestid('courtAttendees').contains(
      'Áki Ákærandi aðstoðarsaksóknari Donald Duck kærði',
    )
  })

  it('should require a accused and prosecutor appeal decisions to be made', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('courtLocation').type('í Dúfnahólum 10')
    cy.getByTestid('sessionBookings').type('lorem')
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').should('not.be.disabled')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('courtLocation').type('í Dúfnahólum 10')
    cy.getByTestid('sessionBookings').type('lorem')
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').should('not.be.disabled')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', `${RULING_ROUTE}/test_id_stadfest`)
  })
})

import faker from 'faker'

import { IC_RULING_ROUTE } from '@island.is/judicial-system/consts'

import { makeInvestigationCase, intercept } from '../../../utils'

describe(`${IC_RULING_ROUTE}/:id`, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should autofill conclusion when accepting decision is chosen and clear the conclusion otherwise', () => {
    const caseData = makeInvestigationCase()

    const caseDataAddition = { ...caseData, demands: faker.lorem.sentence() }

    cy.visit(`${IC_RULING_ROUTE}/test_id_stadfest`)

    intercept(caseDataAddition)

    cy.get('[name="conclusion"]').should('match', ':empty')

    cy.get('#case-decision-accepting').click()

    cy.get('[name="conclusion"]').should('not.match', ':empty')

    cy.get('#case-decision-rejecting').click()

    cy.get('[name="conclusion"]').should('match', ':empty')
  })
})

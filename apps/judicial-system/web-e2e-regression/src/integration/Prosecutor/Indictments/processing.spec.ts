import {
  CREATE_INDICTMENT_ROUTE,
  INDICTMENTS_CASE_FILES_ROUTE,
  INDICTMENTS_PROCESSING_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

import { transitionCase, loginAndCreateCase } from '../../../utils'

describe(CREATE_INDICTMENT_ROUTE, () => {
  let caseId = ''

  before(() => {
    cy.intercept(
      'GET',
      '**/api/nationalRegistry/getPersonByNationalId**',
      (req) => {
        req.reply({ fixture: 'nationalRegistryPersonResponse' })
      },
    ).as('getPersonByNationalId')

    cy.intercept('POST', '**/api/graphql', (req) => {
      if (req.body.query.includes('ProsecutorSelectionUsers')) {
        req.alias = 'gqlProsecutorSelectionUsersQuery'
      }
    })

    loginAndCreateCase(CaseType.INDICTMENT, ['007-2020-0101']).then((id) => {
      caseId = id
      cy.visit(`http://localhost:4200${INDICTMENTS_PROCESSING_ROUTE}/${id}`)
    })
  })

  after(() => {
    transitionCase(caseId, CaseTransition.DELETE)
  })

  it('should validate the form', () => {
    cy.wait('@gqlProsecutorSelectionUsersQuery')
    cy.getByTestid('select-prosecutor').click()
    cy.get('[id="react-select-prosecutor-option-0"]').click()

    cy.getByTestid('select-court').click()
    cy.get('[id="react-select-court-option-0"]').click()

    cy.getByTestid('continueButton').click()
    cy.url().should('contain', INDICTMENTS_CASE_FILES_ROUTE)
  })
})

import { RESTRICTION_CASE_DEFENDANT_ROUTE } from '@island.is/judicial-system/consts'
import { CaseTransition, CaseType } from '@island.is/judicial-system/types'

import {
  loginAndCreateCase,
  mockLawyerRegistry,
  mockNationalRegistry,
  transitionCase,
} from '../../../utils'

describe('Create restriction case', () => {
  let caseId = ''

  before(() => {
    mockNationalRegistry()
    mockLawyerRegistry()

    loginAndCreateCase(CaseType.CUSTODY, ['007-2020-0101']).then((id) => {
      caseId = id
      cy.visit(
        `http://localhost:4200/${RESTRICTION_CASE_DEFENDANT_ROUTE}/${id}`,
      )
    })
  })

  after(() => {
    transitionCase(caseId, CaseTransition.DELETE)
  })

  it('should lookup in national registry for defendants', () => {
    cy.getByTestid('nationalId').type('1112902539').blur()
    cy.getByTestid('accusedName').should('have.value', 'The Joker')
    cy.getByTestid('accusedAddress').should('have.value', 'Jokersway 90')
    cy.getByTestid('select-defendantGender').should('contain', 'Karl')
  })
})

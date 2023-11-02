import { SIGNED_VERDICT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  Case,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  intercept,
  makeProsecutor,
  makeCaseFile,
  mockCase,
} from '../../../utils'

describe('Signed verdict overview - Prosecutor - Restriction cases', () => {
  const caseFile = {
    ...makeCaseFile({ name: 'caseFileName' }),
    category: undefined,
  }
  beforeEach(() => {
    const caseData = mockCase(CaseType.CUSTODY)
    const prosecutor = makeProsecutor()
    const caseDataAddition: Case = {
      ...caseData,
      prosecutor,
      state: CaseState.ACCEPTED,
      validToDate: '2022-06-16T19:51:39.466Z',
      creatingProsecutor: prosecutor,
      caseFiles: [caseFile],
    }

    cy.login(UserRole.PROSECUTOR)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${SIGNED_VERDICT_OVERVIEW_ROUTE}/test_id`)
  })

  it('should display appropriate components on the page', () => {
    cy.getByTestid('caseDates').should('exist')
    cy.get('[data-testid="modifyRulingButton"]').should('not.exist')

    cy.get('input[name="sharedWithProsecutorsOfficeId"]')
    cy.get('[aria-controls="caseFilesAccordionItem"]').click()

    cy.get('#caseFilesAccordionItem').within(() => {
      cy.get(`[aria-label="Opna ${caseFile.name}"]`)
    })
  })
})

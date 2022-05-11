import { DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import {
  Case,
  CaseOrigin,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { intercept } from '../../utils'

describe('Defender case overview', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })

  it('should have a title', () => {
    const theCase: Case = {
      id: 'test_id',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:51:39.466Z',
      state: CaseState.ACCEPTED,
      origin: CaseOrigin.RVG,
      type: CaseType.CUSTODY,
      policeCaseNumber: '007-2021-202000',
    }

    cy.stubAPIResponses()
    cy.visit(`${DEFENDER_ROUTE}/test_id`)

    intercept(theCase)

    cy.getByTestid('caseTitle').should('contain.text', 'Gæsluvarðhald virkt')
  })
})

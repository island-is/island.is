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
    const theCase: Case = {
      id: 'test_id',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:51:39.466Z',
      state: CaseState.ACCEPTED,
      origin: CaseOrigin.RVG,
      type: CaseType.CUSTODY,
      policeCaseNumbers: ['007-2021-202000'],
      defendantWaivesRightToCounsel: false,
    }

    cy.stubAPIResponses()
    intercept(theCase)
    cy.visit(`${DEFENDER_ROUTE}/test_id`)
  })

  it('should have a title', () => {
    cy.getByTestid('caseTitle').should('contain.text', 'Gæsluvarðhald virkt')
  })
})

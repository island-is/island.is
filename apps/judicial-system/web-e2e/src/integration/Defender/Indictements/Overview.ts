import faker from 'faker'

import { DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import {
  Case,
  CaseFileCategory,
  CaseFileState,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { intercept, mockCase } from '../../../utils'

describe('Indictment case overview for defenders', () => {
  const theCase = mockCase(CaseType.MURDER)

  describe('Closed cases', () => {
    beforeEach(() => {
      const caseDataAddition: Case = {
        ...theCase,
        state: CaseState.ACCEPTED,
        caseFiles: [
          {
            created: '2020-09-16T19:51:39.466Z',
            modified: '2020-09-16T19:51:39.466Z',
            id: faker.datatype.uuid(),
            name: faker.random.word(),
            caseId: faker.datatype.uuid(),
            type: 'png',
            state: CaseFileState.STORED_IN_RVG,
            size: 1,
            category: CaseFileCategory.COURT_RECORD,
          },
          {
            created: '2020-09-16T19:51:39.466Z',
            modified: '2020-09-16T19:51:39.466Z',
            id: faker.datatype.uuid(),
            name: faker.random.word(),
            caseId: faker.datatype.uuid(),
            type: 'png',
            state: CaseFileState.STORED_IN_RVG,
            size: 1,
            category: CaseFileCategory.RULING,
          },
          {
            created: '2020-09-16T19:51:39.466Z',
            modified: '2020-09-16T19:51:39.466Z',
            id: faker.datatype.uuid(),
            name: faker.random.word(),
            caseId: faker.datatype.uuid(),
            type: 'png',
            state: CaseFileState.STORED_IN_RVG,
            size: 1,
            category: CaseFileCategory.COST_BREAKDOWN,
          },
        ],
      }

      cy.stubAPIResponses()
      intercept(caseDataAddition)
      cy.visit(`${DEFENDER_ROUTE}/akaera/test_id`)
    })

    it('should list all case files, including COURT_RECORD and RULING', () => {
      cy.get('[data-testid="PDFButton"]').should('have.length', 3)
    })
  })

  describe('Open cases', () => {
    beforeEach(() => {
      const caseDataAddition: Case = {
        ...theCase,
        state: CaseState.RECEIVED,
        caseFiles: [
          {
            created: '2020-09-16T19:51:39.466Z',
            modified: '2020-09-16T19:51:39.466Z',
            id: faker.datatype.uuid(),
            name: faker.random.word(),
            caseId: faker.datatype.uuid(),
            type: 'png',
            state: CaseFileState.STORED_IN_RVG,
            size: 1,
            category: CaseFileCategory.COURT_RECORD,
          },
          {
            created: '2020-09-16T19:51:39.466Z',
            modified: '2020-09-16T19:51:39.466Z',
            id: faker.datatype.uuid(),
            name: faker.random.word(),
            caseId: faker.datatype.uuid(),
            type: 'png',
            state: CaseFileState.STORED_IN_RVG,
            size: 1,
            category: CaseFileCategory.RULING,
          },
          {
            created: '2020-09-16T19:51:39.466Z',
            modified: '2020-09-16T19:51:39.466Z',
            id: faker.datatype.uuid(),
            name: faker.random.word(),
            caseId: faker.datatype.uuid(),
            type: 'png',
            state: CaseFileState.STORED_IN_RVG,
            size: 1,
            category: CaseFileCategory.COST_BREAKDOWN,
          },
        ],
      }

      cy.stubAPIResponses()
      intercept(caseDataAddition)
      cy.visit(`${DEFENDER_ROUTE}/akaera/test_id`)
    })

    it('should not list casefiles with category COURT_RECORD or RULING', () => {
      cy.get('[data-testid="PDFButton"]').should('have.length', 1)
    })
  })
})

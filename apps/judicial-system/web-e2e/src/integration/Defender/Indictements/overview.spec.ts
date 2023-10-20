import { DEFENDER_INDICTMENT_ROUTE } from '@island.is/judicial-system/consts'
import {
  Case,
  CaseFileCategory,
  CaseState,
  CaseType,
  IndictmentSubtype,
} from '@island.is/judicial-system/types'

import {
  intercept,
  makeCaseFile,
  makeJudge,
  makeProsecutor,
  mockCase,
} from '../../../utils'

describe('Indictment case overview for defenders', () => {
  const theCase = mockCase(CaseType.INDICTMENT, IndictmentSubtype.MURDER)
  const prosecutor = makeProsecutor()
  const judge = makeJudge()

  describe('Closed cases', () => {
    beforeEach(() => {
      const caseDataAddition: Case = {
        ...theCase,
        state: CaseState.ACCEPTED,
        courtCaseNumber: 'S-202/2020',
        prosecutor,
        judge,
        caseFiles: [
          makeCaseFile({ category: CaseFileCategory.COURT_RECORD }),
          makeCaseFile({ category: CaseFileCategory.RULING }),
          makeCaseFile({ category: CaseFileCategory.COST_BREAKDOWN }),
        ],
      }

      cy.stubAPIResponses()
      intercept(caseDataAddition)
      cy.visit(`${DEFENDER_INDICTMENT_ROUTE}/test_id`)
    })

    it('should list all case files, including COURT_RECORD and RULING', () => {
      cy.get('[data-testid="PDFButton"]').should('have.length', 3)
    })

    it('should display relevant data', () => {
      cy.getByTestid('infoCard').contains(
        `${theCase.defendants![0].name}, kt. ${
          theCase.defendants![0].nationalId
        }, ${theCase.defendants![0].address}`,
      )
      cy.getByTestid('infoCardDataContainer0').contains(
        theCase.policeCaseNumbers[0],
      )
      cy.getByTestid('infoCardDataContainer1').contains('S-202/2020')
      cy.getByTestid('infoCardDataContainer2').contains(
        prosecutor!.institution!.name,
      )
      cy.getByTestid('infoCardDataContainer3').contains(theCase.court!.name)
      cy.getByTestid('infoCardDataContainer4').contains(prosecutor.name)
      cy.getByTestid('infoCardDataContainer5').contains(judge.name)
      cy.getByTestid('infoCardDataContainer6').contains('Manndráp')
    })
  })

  describe('Open cases', () => {
    beforeEach(() => {
      const caseDataAddition: Case = {
        ...theCase,
        state: CaseState.RECEIVED,
        prosecutor,
        caseFiles: [
          makeCaseFile({ category: CaseFileCategory.COURT_RECORD }),
          makeCaseFile({ category: CaseFileCategory.RULING }),
          makeCaseFile({ category: CaseFileCategory.COST_BREAKDOWN }),
        ],
      }

      cy.stubAPIResponses()
      intercept(caseDataAddition)
      cy.visit(`${DEFENDER_INDICTMENT_ROUTE}/test_id`)
    })

    it('should not list casefiles with category COURT_RECORD or RULING', () => {
      cy.get('[data-testid="PDFButton"]').should('have.length', 1)
    })

    it('should display relevant data', () => {
      cy.getByTestid('infoCard').contains(
        `${theCase.defendants![0].name}, kt. ${
          theCase.defendants![0].nationalId
        }, ${theCase.defendants![0].address}`,
      )

      cy.getByTestid('infoCardDataContainer0').contains('16. sept. 2020')
      cy.getByTestid('infoCardDataContainer1').contains(prosecutor.name)
      cy.getByTestid('infoCardDataContainer2').contains(
        theCase.policeCaseNumbers[0],
      )
      cy.getByTestid('infoCardDataContainer3').contains(theCase.court!.name)
      cy.getByTestid('infoCardDataContainer4').contains('Manndráp')
    })
  })
})

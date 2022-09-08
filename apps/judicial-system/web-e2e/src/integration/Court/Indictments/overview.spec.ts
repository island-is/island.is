import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import { INDICTMENTS_COURT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'

import {
  makeProsecutor,
  intercept,
  mockCase,
  makeCaseFile,
} from '../../../utils'

describe(`${INDICTMENTS_COURT_OVERVIEW_ROUTE}/:id`, () => {
  const caseData = mockCase(CaseType.TAX_VIOLATION)
  const prosecutor = makeProsecutor()

  beforeEach(() => {
    const caseDataAddition: Case = {
      ...caseData,
      creatingProsecutor: prosecutor,
      prosecutor: prosecutor,
      state: CaseState.RECEIVED,
      caseFiles: [makeCaseFile(caseData.id, 'test.pdf')],
      policeCaseNumbers: ['007-2022-01', '007-2022-02'],
    }

    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INDICTMENTS_COURT_OVERVIEW_ROUTE}/test_id_stadfest`)
  })

  it('should display relevant data', () => {
    cy.getByTestid('infoCard').contains(
      `${caseData.defendants[0].name}, kt. ${caseData.defendants[0].nationalId}, ${caseData.defendants[0].address}`,
    )

    cy.getByTestid('infoCardDataContainer0').contains('16. sept. 2020')
    cy.getByTestid('infoCardDataContainer1').contains(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      prosecutor!.institution!.name,
    )
    cy.getByTestid('infoCardDataContainer2').contains('007-2022-01')
    cy.getByTestid('infoCardDataContainer2').contains('007-2022-02')
    cy.getByTestid('infoCardDataContainer3').contains(caseData.court.name)
    cy.getByTestid('infoCardDataContainer4').contains('Skattalagabrot')

    cy.getByTestid('PDFButton').contains('test.pdf')
  })

  // it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
  //   cy.getByTestid('continueButton').click()
  //   cy.url().should('include', INDICITMENT_COURT_OVERVIEW_ROUTE)
  // })
})

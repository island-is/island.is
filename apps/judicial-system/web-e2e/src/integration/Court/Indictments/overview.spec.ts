import {
  Case,
  CaseFileCategory,
  CaseState,
  CaseType,
  IndictmentSubtype,
  UserRole,
} from '@island.is/judicial-system/types'
import { INDICTMENTS_COURT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'

import {
  makeProsecutor,
  intercept,
  mockCase,
  makeCaseFile,
} from '../../../utils'

describe(`${INDICTMENTS_COURT_OVERVIEW_ROUTE}/:id`, () => {
  const caseData = mockCase(
    CaseType.INDICTMENT,
    IndictmentSubtype.TAX_VIOLATION,
  )
  const prosecutor = makeProsecutor('Assigned Prosecutor')
  const creatingProsecutor = makeProsecutor('Creating Prosecutor')

  beforeEach(() => {
    const caseDataAddition: Case = {
      ...caseData,
      creatingProsecutor,
      prosecutor,
      state: CaseState.RECEIVED,
      caseFiles: [
        makeCaseFile({ caseId: caseData.id, name: 'test.pdf' }),
        makeCaseFile({ category: CaseFileCategory.COURT_RECORD }),
        makeCaseFile({ category: CaseFileCategory.RULING }),
      ],
      indictmentSubtypes: {
        '007-2022-01': [IndictmentSubtype.TAX_VIOLATION],
      },
      policeCaseNumbers: ['007-2022-01', '007-2022-02'],
    }

    cy.stubAPIResponses()
    cy.login(UserRole.DISTRICT_COURT_JUDGE)
    intercept(caseDataAddition)
    cy.visit(`${INDICTMENTS_COURT_OVERVIEW_ROUTE}/test_id_stadfest`)
  })

  it('should display relevant data', () => {
    cy.getByTestid('infoCard').contains(
      `${caseData.defendants![0]!.name}, kt. ${
        caseData.defendants![0]!.nationalId
      }, ${caseData.defendants![0]!.address}`,
    )

    cy.getByTestid('infoCardDataContainer0').contains('16. sept. 2020')
    cy.getByTestid('infoCardDataContainer1').contains(prosecutor!.name)
    cy.getByTestid('infoCardDataContainer2').contains('007-2022-01')
    cy.getByTestid('infoCardDataContainer2').contains('007-2022-02')
    cy.getByTestid('infoCardDataContainer3').contains(caseData!.court!.name)
    cy.getByTestid('infoCardDataContainer4').contains('Skattalagabrot')

    cy.getByTestid('PDFButton').contains('test.pdf')
  })

  // it('should list all case files, including COURT_RECORD and RULING', () => {
  //   cy.get('[data-testid="PDFButton"]').should('have.length', 3)
  // })

  // it('should navigate to the next page when the next button is clicked', () => {
  //   cy.getByTestid('continueButton').click()
  //   cy.url().should('include', `${INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}`)
  // })
})

import {
  INDICTMENTS_POLICE_CASE_FILES_ROUTE,
  INDICTMENTS_CASE_FILE_ROUTE,
  INDICTMENTS_PROCESSING_ROUTE,
} from '@island.is/judicial-system/consts'
import { CaseType, UserRole } from '@island.is/judicial-system/types'

import {
  makeCourt,
  mockCase,
  makeProsecutor,
  intercept,
  makeCaseFile,
} from '../../../utils'

describe(`${INDICTMENTS_POLICE_CASE_FILES_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.INDICTMENT)
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      court: makeCourt(),
      caseFiles: [
        makeCaseFile({ policeCaseNumber: caseData.policeCaseNumbers[0] }),
        makeCaseFile({ policeCaseNumber: caseData.policeCaseNumbers[0] }),
        makeCaseFile({ policeCaseNumber: caseData.policeCaseNumbers[0] }),
      ],
    }

    cy.login(UserRole.PROSECUTOR)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INDICTMENTS_CASE_FILE_ROUTE}/test_id`)
  })

  it('should show an success alert if all files have been moved under chapters', () => {
    const caseData = mockCase(CaseType.INDICTMENT)
    const caseDataAddition = {
      ...caseData,
      prosecutor: makeProsecutor(),
      court: makeCourt(),
      caseFiles: [
        makeCaseFile({
          policeCaseNumber: caseData.policeCaseNumbers[0],
          chapter: 0,
          orderWithinChapter: 0,
        }),
        makeCaseFile({
          policeCaseNumber: caseData.policeCaseNumbers[0],
          chapter: 0,
          orderWithinChapter: 1,
        }),
        makeCaseFile({
          policeCaseNumber: caseData.policeCaseNumbers[0],
          chapter: 0,
          orderWithinChapter: 2,
        }),
      ],
    }

    intercept(caseDataAddition)

    cy.getByTestid('alertMessage').should('be.visible')
  })

  it('should navigate to the correct page on continue', () => {
    cy.getByTestid('continueButton').click()
    cy.url().should('contain', INDICTMENTS_PROCESSING_ROUTE)
  })
})

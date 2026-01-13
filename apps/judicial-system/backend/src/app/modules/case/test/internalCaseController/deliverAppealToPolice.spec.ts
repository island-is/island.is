import { Base64 } from 'js-base64'
import { v4 as uuid } from 'uuid'

import {
  CaseAppealState,
  CaseFileCategory,
  CaseOrigin,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { randomDate } from '../../../../test'
import { FileService } from '../../../file'
import { PoliceDocumentType, PoliceService } from '../../../police'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver appeal to police', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockFileService: FileService
  let mockPoliceService: PoliceService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { fileService, policeService, internalCaseController } =
      await createTestingCaseModule()

    mockFileService = fileService
    mockPoliceService = policeService

    const mockGetCaseFileFromS3 = fileService.getCaseFileFromS3 as jest.Mock
    mockGetCaseFileFromS3.mockRejectedValue(new Error('Some error'))
    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverAppealToPolice(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver appeal to police', () => {
    const caseId = uuid()
    const caseType = CaseType.CUSTODY
    const caseState = CaseState.ACCEPTED
    const policeCaseNumber = uuid()
    const courtCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const validToDate = randomDate()
    const caseConclusion = 'test conclusion'
    const appealRulingPdf = 'test appeal ruling'
    const caseFile = { id: uuid(), category: CaseFileCategory.APPEAL_RULING }
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      appealState: CaseAppealState.COMPLETED,
      policeCaseNumbers: [policeCaseNumber],
      courtCaseNumber,
      defendants: [{ nationalId: defendantNationalId }],
      validToDate,
      conclusion: caseConclusion,
      caseFiles: [caseFile],
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockGetCaseFileFromS3 =
        mockFileService.getCaseFileFromS3 as jest.Mock
      mockGetCaseFileFromS3.mockResolvedValueOnce(appealRulingPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })
    it('should update the police case', async () => {
      expect(mockFileService.getCaseFileFromS3).toHaveBeenCalledWith(
        theCase,
        caseFile,
      )
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        courtCaseNumber,
        defendantNationalId,
        validToDate,
        caseConclusion,
        [
          {
            type: PoliceDocumentType.RVUL,
            courtDocument: Base64.btoa(appealRulingPdf),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })
})

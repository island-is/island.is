import { Base64 } from 'js-base64'
import { v4 as uuid } from 'uuid'

import {
  CaseFileCategory,
  CaseOrigin,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { FileService } from '../../../file'
import { PoliceDocumentType, PoliceService } from '../../../police'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../factories')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver indictment case to police', () => {
  const date = randomDate()
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

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockGetCaseFileFromS3 = fileService.getCaseFileFromS3 as jest.Mock
    mockGetCaseFileFromS3.mockRejectedValue(new Error('Some error'))
    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentCaseToPolice(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver case to police', () => {
    const caseId = uuid()
    const caseType = CaseType.INDICTMENT
    const caseState = CaseState.COMPLETED
    const policeCaseNumber = uuid()
    const courtCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const courtRecordPdf = 'test court record'
    const rulingPdf = 'test ruling'
    const caseFile1 = {
      id: uuid(),
      key: uuid(),
      isKeyAccessible: true,
      category: CaseFileCategory.COURT_RECORD,
    }
    const caseFile2 = {
      id: uuid(),
      key: uuid(),
      isKeyAccessible: true,
      category: CaseFileCategory.RULING,
    }
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      policeCaseNumbers: [policeCaseNumber],
      courtCaseNumber,
      defendants: [{ nationalId: defendantNationalId }],
      caseFiles: [caseFile1, caseFile2],
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockGetCaseFileFromS3 =
        mockFileService.getCaseFileFromS3 as jest.Mock
      mockGetCaseFileFromS3.mockResolvedValueOnce(courtRecordPdf)
      mockGetCaseFileFromS3.mockResolvedValueOnce(rulingPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should update the police case', async () => {
      expect(mockFileService.getCaseFileFromS3).toHaveBeenCalledWith(
        theCase,
        caseFile1,
      )
      expect(mockFileService.getCaseFileFromS3).toHaveBeenCalledWith(
        theCase,
        caseFile2,
      )
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        caseType,
        caseState,
        policeCaseNumber,
        courtCaseNumber,
        defendantNationalId,
        date,
        '',
        [
          {
            type: PoliceDocumentType.RVTB,
            courtDocument: Base64.btoa(courtRecordPdf),
          },
          {
            type: PoliceDocumentType.RVDO,
            courtDocument: Base64.btoa(rulingPdf),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })
})

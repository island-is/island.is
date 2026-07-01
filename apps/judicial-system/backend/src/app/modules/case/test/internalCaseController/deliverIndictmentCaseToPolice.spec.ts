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

import { PoliceDocumentType, PoliceService } from '../../../police'
import { Case, CaseFile } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver indictment case to police', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockPoliceService: PoliceService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { policeService, internalCaseController } =
      await createTestingCaseModule()

    mockPoliceService = policeService

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

  describe('deliver indictment case to police', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid()
    const courtCaseNumber = uuid()
    const courtRecordContent = 'test court record'

    const courtRecordFile = {
      id: uuid(),
      category: CaseFileCategory.COURT_RECORD,
      isKeyAccessible: true,
    } as CaseFile

    const rulingFile = {
      id: uuid(),
      category: CaseFileCategory.RULING,
      isKeyAccessible: true,
    } as CaseFile

    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      policeCaseNumbers: [policeCaseNumber],
      courtCaseNumber,
      defendants: [{ nationalId: uuid() }],
      conclusion: '',
      caseFiles: [courtRecordFile, rulingFile],
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockGetCaseFile = jest
        .fn()
        .mockResolvedValue(Buffer.from(courtRecordContent))

      const { fileService, policeService, internalCaseController } =
        await createTestingCaseModule()

      mockPoliceService = policeService

      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)
      ;(fileService.getCaseFileFromS3 as jest.Mock) = mockGetCaseFile

      givenWhenThen = async (caseId: string, theCase: Case) => {
        const then = {} as Then

        await internalCaseController
          .deliverIndictmentCaseToPolice(caseId, theCase, { user })
          .then((result) => (then.result = result))
          .catch((error) => (then.error = error))

        return then
      }

      then = await givenWhenThen(caseId, theCase)
    })

    it('should only deliver court record files, not ruling files', () => {
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        expect.any(String),
        CaseType.INDICTMENT,
        CaseState.COMPLETED,
        policeCaseNumber,
        courtCaseNumber,
        expect.any(String),
        expect.any(Date),
        '',
        [
          {
            type: PoliceDocumentType.RVTB,
            courtDocument: Base64.btoa(courtRecordContent),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })
})

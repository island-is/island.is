import { Base64 } from 'js-base64'
import { Transaction } from 'sequelize'
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
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, fileService, policeService, internalCaseController } =
      await createTestingCaseModule()

    mockFileService = fileService
    mockPoliceService = policeService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

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

  describe('deliver indictment case to police', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid()
    const courtCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const courtRecordPdf = 'test court record'
    const courtRecordFile = {
      id: uuid(),
      key: uuid(),
      isKeyAccessible: true,
      category: CaseFileCategory.COURT_RECORD,
    }
    const rulingFile = {
      id: uuid(),
      key: uuid(),
      isKeyAccessible: true,
      category: CaseFileCategory.RULING,
    }
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      policeCaseNumbers: [policeCaseNumber],
      courtCaseNumber,
      defendants: [{ nationalId: uuid() }],
      caseFiles: [courtRecordFile, rulingFile],
      policeDefendantNationalId: defendantNationalId,
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockGetCaseFileFromS3 =
        mockFileService.getCaseFileFromS3 as jest.Mock
      mockGetCaseFileFromS3.mockResolvedValueOnce(courtRecordPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should only deliver court record files, not ruling files', () => {
      expect(mockFileService.getCaseFileFromS3).toHaveBeenCalledWith(
        theCase,
        courtRecordFile,
      )
      expect(mockFileService.getCaseFileFromS3).not.toHaveBeenCalledWith(
        theCase,
        rulingFile,
      )
      expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
        user,
        caseId,
        CaseType.INDICTMENT,
        CaseState.COMPLETED,
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
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })
})

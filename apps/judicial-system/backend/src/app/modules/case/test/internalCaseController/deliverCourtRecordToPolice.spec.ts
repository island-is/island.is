import { Base64 } from 'js-base64'
import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseOrigin,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { getCourtRecordPdfAsString } from '../../../../formatters'
import { randomDate } from '../../../../test'
import { PoliceDocumentType, PoliceService } from '../../../police'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'
import { PdfService } from '../../pdf.service'

jest.mock('../../../../factories')
jest.mock('../../../../formatters/generatedPdfs/courtRecordPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver court record to police', () => {
  const date = randomDate()
  const userId = uuid()
  const user = { id: userId } as User

  let mockPdfService: PdfService
  let mockPoliceService: PoliceService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    // The court record formatters are shared between case types,
    // so we need to know which of them was called in each test
    jest.clearAllMocks()

    const {
      sequelize,
      policeService,
      internalCaseService,
      internalCaseController,
    } = await createTestingCaseModule()

    mockPoliceService = policeService
    mockPdfService = (
      internalCaseService as unknown as { pdfService: PdfService }
    ).pdfService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation((fn: (t: Transaction) => unknown) =>
      fn(transaction),
    )

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValue(date)
    const mockGetCourtRecord = getCourtRecordPdfAsString as jest.Mock
    mockGetCourtRecord.mockRejectedValue(new Error('Some error'))
    jest
      .spyOn(mockPdfService, 'getCourtRecordPdfForIndictmentCase')
      .mockRejectedValue(new Error('Some error'))
    const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
    mockUpdatePoliceCase.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverCourtRecordToPolice(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver court record of a request case to police', () => {
    const caseId = uuid()
    const caseType = CaseType.CUSTODY
    const caseState = CaseState.ACCEPTED
    const policeCaseNumber = uuid()
    const courtCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const validToDate = randomDate()
    const caseConclusion = 'test conclusion'
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      policeCaseNumbers: [policeCaseNumber],
      courtCaseNumber,
      validToDate,
      conclusion: caseConclusion,
      policeDefendantNationalId: defendantNationalId,
    } as Case
    const courtRecordPdf = 'test court record'

    let then: Then

    beforeEach(async () => {
      const mockGetCourtRecord = getCourtRecordPdfAsString as jest.Mock
      mockGetCourtRecord.mockResolvedValueOnce(courtRecordPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should deliver the generated court record to police', async () => {
      expect(getCourtRecordPdfAsString).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
      expect(
        mockPdfService.getCourtRecordPdfForIndictmentCase,
      ).not.toHaveBeenCalled()
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
            type: PoliceDocumentType.RVTB,
            courtDocument: Base64.btoa(courtRecordPdf),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })

  describe('deliver court record of an indictment case to police', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid()
    const courtCaseNumber = uuid()
    const defendantNationalId = '0123456789'
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      policeCaseNumbers: [policeCaseNumber],
      courtCaseNumber,
      withCourtSessions: true,
      policeDefendantNationalId: defendantNationalId,
    } as Case
    const courtRecordPdf = Buffer.from('test court record')

    let then: Then

    beforeEach(async () => {
      jest
        .spyOn(mockPdfService, 'getCourtRecordPdfForIndictmentCase')
        .mockResolvedValueOnce(courtRecordPdf)
      const mockUpdatePoliceCase =
        mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should deliver the generated court record to police', async () => {
      expect(getCourtRecordPdfAsString).not.toHaveBeenCalled()
      expect(
        mockPdfService.getCourtRecordPdfForIndictmentCase,
      ).toHaveBeenCalledWith(theCase, user, transaction)
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
            courtDocument: Base64.btoa(courtRecordPdf.toString('binary')),
          },
        ],
      )
      expect(then.result.delivered).toEqual(true)
    })
  })

  describe('court record pdf generation fails', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: CaseType.CUSTODY,
      state: CaseState.ACCEPTED,
      policeCaseNumbers: [uuid()],
    } as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should not deliver the court record', async () => {
      expect(mockPoliceService.updatePoliceCase).not.toHaveBeenCalled()
      expect(then.result.delivered).toEqual(false)
    })
  })
})

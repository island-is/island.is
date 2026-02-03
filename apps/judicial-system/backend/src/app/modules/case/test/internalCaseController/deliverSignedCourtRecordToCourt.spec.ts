import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { getCourtRecordPdfAsBuffer } from '../../../../formatters'
import { randomDate } from '../../../../test'
import { CourtService } from '../../../court'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../formatters/courtRecordPdf')
jest.mock('../../../../factories/date.factory')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver signed court record to court', () => {
  const userId = uuid()
  const user = { id: userId } as User

  const pdf = Buffer.from('signed court record')
  const now = randomDate()

  let mockCourtService: CourtService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const { sequelize, courtService, internalCaseController, awsS3Service } =
      await createTestingCaseModule()

    mockCourtService = courtService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockGetSignedCourtRecordPdf =
      awsS3Service.getGeneratedRequestCaseObject as jest.Mock
    mockGetSignedCourtRecordPdf.mockResolvedValueOnce(pdf)

    const mockCreateCourtRecord =
      mockCourtService.createCourtRecord as jest.Mock
    mockCreateCourtRecord.mockResolvedValueOnce(uuid())

    const mockGeneratePdf = getCourtRecordPdfAsBuffer as jest.Mock
    mockGeneratePdf.mockClear()

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverSignedCourtRecordToCourt(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('signed court record delivered', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should not generate a court record PDF', () => {
      expect(getCourtRecordPdfAsBuffer).not.toHaveBeenCalled()
    })

    it('should upload the signed court record to court', () => {
      expect(mockCourtService.createCourtRecord).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        expect.stringMatching(/^Þingbók /),
        expect.stringMatching(/\.pdf$/),
        'application/pdf',
        pdf,
      )
    })

    it('should return a success response', () => {
      expect(then.result.delivered).toBe(true)
    })
  })
})

describe('upload fails', () => {
  const userId = uuid()
  const user = { id: userId } as User
  const caseId = uuid()
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const theCase = { id: caseId, courtId, courtCaseNumber } as Case
  const pdf = Buffer.from('signed court record')

  let transaction: Transaction
  let then: Then

  beforeEach(async () => {
    const { sequelize, internalCaseController, awsS3Service, courtService } =
      await createTestingCaseModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockGetSignedCourtRecordPdf =
      awsS3Service.getGeneratedRequestCaseObject as jest.Mock
    mockGetSignedCourtRecordPdf.mockResolvedValueOnce(pdf)

    const mockCreateCourtRecord = courtService.createCourtRecord as jest.Mock
    mockCreateCourtRecord.mockRejectedValueOnce(new Error('upload fail'))

    then = (await internalCaseController
      .deliverSignedCourtRecordToCourt(caseId, theCase, { user })
      .then((result) => ({ result }))
      .catch((error) => ({ error }))) as Then
  })

  it('should return a failure response', () => {
    expect(then.result.delivered).toBe(false)
  })
})

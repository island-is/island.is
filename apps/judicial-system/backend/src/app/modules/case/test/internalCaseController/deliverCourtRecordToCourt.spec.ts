import format from 'date-fns/format'
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

describe('InternalCaseController - Deliver court record to court', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockGet = getCourtRecordPdfAsBuffer as jest.Mock
    mockGet.mockRejectedValue(new Error('Some error'))

    const { courtService, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockCreateCourtRecord =
      mockCourtService.createCourtRecord as jest.Mock
    mockCreateCourtRecord.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverCourtRecordToCourt(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('court record delivered', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const pdf = Buffer.from('test court record')
    const now = randomDate()

    let then: Then

    beforeEach(async () => {
      const mockNowFactory = nowFactory as jest.Mock
      mockNowFactory.mockReturnValue(now)
      const mockGet = getCourtRecordPdfAsBuffer as jest.Mock
      mockGet.mockResolvedValueOnce(pdf)
      const mockCreateCourtRecord =
        mockCourtService.createCourtRecord as jest.Mock
      mockCreateCourtRecord.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, theCase)
    })

    it('should generate the court record', async () => {
      expect(getCourtRecordPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
    })

    it('should create a court record at court', async () => {
      expect(mockCourtService.createCourtRecord).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        `Þingbók ${courtCaseNumber} ${format(now, 'yyyy-MM-dd HH:mm')}`,
        `Þingbók ${courtCaseNumber} ${format(now, 'yyyy-MM-dd HH:mm')}.pdf`,
        'application/pdf',
        pdf,
      )
    })

    it('should return a success response', async () => {
      expect(then.result.delivered).toEqual(true)
    })
  })

  describe('delivery to court fails', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const pdf = Buffer.from('test court record')
    let then: Then

    beforeEach(async () => {
      const mockGet = getCourtRecordPdfAsBuffer as jest.Mock
      mockGet.mockResolvedValueOnce(pdf)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })

  describe('pdf generation fails', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })
})

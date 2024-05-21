import format from 'date-fns/format'
import { uuid } from 'uuidv4'

import { User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../factories/date.factory')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver signed ruling to court', () => {
  const userId = uuid()
  const user = { id: userId } as User

  let mockCourtService: CourtService
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { courtService, awsS3Service, internalCaseController } =
      await createTestingCaseModule()

    mockCourtService = courtService
    const mockCreateDocument = mockCourtService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    mockAwsS3Service = awsS3Service
    const mockGetGeneratedRequestCaseObject =
      mockAwsS3Service.getRequestObject as jest.Mock
    mockGetGeneratedRequestCaseObject.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverSignedRulingToCourt(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('signed ruling delivered', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const pdf = Buffer.from('test ruling')
    const now = randomDate()

    let then: Then

    beforeEach(async () => {
      const mockNowFactory = nowFactory as jest.Mock
      mockNowFactory.mockReturnValue(now)
      const mockGetGeneratedRequestCaseObject =
        mockAwsS3Service.getRequestObject as jest.Mock
      mockGetGeneratedRequestCaseObject.mockResolvedValueOnce(pdf)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, theCase)
    })

    it('should deliver the signed ruling to court', async () => {
      expect(mockAwsS3Service.getRequestObject).toHaveBeenCalledWith(
        `${caseId}/ruling.pdf`,
      )
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.COURT_DOCUMENTS,
        `Úrskurður ${courtCaseNumber} ${format(now, 'yyyy-MM-dd HH:mm')}`,
        `Úrskurður ${courtCaseNumber} ${format(now, 'yyyy-MM-dd HH:mm')}.pdf`,
        'application/pdf',
        pdf,
      )
      expect(then.result.delivered).toEqual(true)
    })
  })

  describe('deliver to court fails', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const pdf = Buffer.from('test ruling')
    let then: Then

    beforeEach(async () => {
      const mockGetGeneratedRequestCaseObject =
        mockAwsS3Service.getRequestObject as jest.Mock
      mockGetGeneratedRequestCaseObject.mockResolvedValueOnce(pdf)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })

  describe('get from AWS S3 fails', () => {
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

import { uuid } from 'uuidv4'

import { createTestingCaseModule } from '../createTestingCaseModule'
import { AwsS3Service } from '../../../aws-s3'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver signed ruling to court', () => {
  let mockCourtService: CourtService
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      courtService,
      awsS3Service,
      internalCaseController,
    } = await createTestingCaseModule()

    mockCourtService = courtService
    const mockCreateDocument = mockCourtService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    mockAwsS3Service = awsS3Service
    const mockGetObject = mockAwsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverSignedRulingToCourt(caseId, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver signed ruling to court', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const pdf = Buffer.from('test ruling')
    let then: Then

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(pdf)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, theCase)
    })

    it('should get the signed ruling from S3', async () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        `generated/${caseId}/ruling.pdf`,
      )
    })

    it('should create a ruling at court', async () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.COURT_DOCUMENTS,
        `Úrskurður ${courtCaseNumber}`,
        `Úrskurður ${courtCaseNumber}.pdf`,
        'application/pdf',
        pdf,
        undefined,
      )
    })

    it('should return a success response', async () => {
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
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(pdf)

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

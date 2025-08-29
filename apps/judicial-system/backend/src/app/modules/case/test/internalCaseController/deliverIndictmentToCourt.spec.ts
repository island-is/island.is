import { uuid } from 'uuidv4'

import {
  CaseState,
  CaseType,
  IndictmentSubtype,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { createIndictment } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../formatters/indictmentPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver indictment to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    policeCaseNumbers: [policeCaseNumber],
    indictmentSubtypes: {
      [policeCaseNumber]: [IndictmentSubtype.TRAFFIC_VIOLATION],
    },
    courtId,
    courtCaseNumber,
    indictmentHash: uuid(),
  } as Case
  const pdf = Buffer.from('test indictment')

  let mockAwsS3Service: AwsS3Service
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, courtService, internalCaseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    const mockGetObject = mockAwsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))

    const mockCreateIndictment = createIndictment as jest.Mock
    mockCreateIndictment.mockRejectedValue(new Error('Some error'))

    mockCourtService = courtService
    const mockCreateDocument = mockCourtService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliverIndictmentToCourt(caseId, theCase, { user })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver generated indictment pdf to court', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreateIndictment = createIndictment as jest.Mock
      mockCreateIndictment.mockResolvedValueOnce(pdf)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, theCase)
    })

    it('should deliver the indictment', () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        theCase.type,
        `${theCase.id}/indictment.pdf`,
      )
      expect(createIndictment).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
        undefined,
      )
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.INDICTMENT_DOCUMENTS,
        `Ákæra ${courtCaseNumber}`,
        `Ákæra ${courtCaseNumber}.pdf`,
        'application/pdf',
        pdf,
      )
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('deliver indictment pdf from AWS S3 to court', () => {
    beforeEach(async () => {
      const mockGetGeneratedIndictmentCaseObject =
        mockAwsS3Service.getObject as jest.Mock
      mockGetGeneratedIndictmentCaseObject.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase)
    })

    it('should use the AWS S3 pdf', () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.INDICTMENT_DOCUMENTS,
        `Ákæra ${courtCaseNumber}`,
        `Ákæra ${courtCaseNumber}.pdf`,
        'application/pdf',
        pdf,
      )
    })
  })

  describe('delivery to court fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreateIndictment = createIndictment as jest.Mock
      mockCreateIndictment.mockResolvedValueOnce(pdf)

      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })

  describe('pdf generation fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })
})

import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import { CaseState, User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { createCaseFilesRecord } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../formatters/caseFilesRecordPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  policeCaseNumber: string,
  theCase: Case,
) => Promise<Then>

describe('InternalCaseController - Deliver case files record to court', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const courtId = uuid()
  const courtCaseNumber = uuid()
  const theCase = {
    id: caseId,
    state: CaseState.ACCEPTED,
    policeCaseNumbers: [policeCaseNumber],
    courtId,
    courtCaseNumber,
  } as Case
  const pdf = Buffer.from('test case files record')

  let mockawsS3Service: AwsS3Service
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const mockGet = createCaseFilesRecord as jest.Mock
    mockGet.mockRejectedValue(new Error('Some error'))

    const { awsS3Service, courtService, internalCaseController } =
      await createTestingCaseModule()

    mockawsS3Service = awsS3Service
    const mockGetObject = mockawsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))
    const mockPutObject = mockawsS3Service.putObject as jest.Mock
    mockPutObject.mockRejectedValue(new Error('Some error'))

    mockCourtService = courtService
    const mockCreateDocument = mockCourtService.createDocument as jest.Mock
    mockCreateDocument.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      caseId: string,
      policeCaseNumber: string,
      theCase: Case,
    ) => {
      const then = {} as Then

      await internalCaseController
        .deliverCaseFilesRecordToCourt(caseId, policeCaseNumber, theCase, {
          user,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case files record delivered', () => {
    let then: Then

    beforeEach(async () => {
      const mockGet = createCaseFilesRecord as jest.Mock
      mockGet.mockResolvedValueOnce(pdf)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should try to get the pdf from AWS S3 indictment completed folder', () => {
      expect(mockawsS3Service.getObject).toHaveBeenNthCalledWith(
        1,
        `indictments/completed/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
    })

    it('should try to get the pdf from AWS S3 indictment folder', () => {
      expect(mockawsS3Service.getObject).toHaveBeenNthCalledWith(
        2,
        `indictments/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
    })

    it('should generate the case files record', async () => {
      expect(createCaseFilesRecord).toHaveBeenCalledWith(
        theCase,
        policeCaseNumber,
        [],
        expect.any(Function),
      )
    })

    it('shoulc store the case files record in AWS S3', async () => {
      expect(mockawsS3Service.putObject).toHaveBeenCalledWith(
        `indictments/completed/${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
        pdf.toString(),
      )
    })

    it('should create a case files record at court', async () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.CASE_DOCUMENTS,
        `Skjalaskrá ${policeCaseNumber}`,
        `Skjalaskrá ${policeCaseNumber}.pdf`,
        'application/pdf',
        pdf,
      )
    })

    it('should return a success response', async () => {
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('pdf returned from AWS S3 indictment completed folder', () => {
    beforeEach(async () => {
      const mockGetObject = mockawsS3Service.getObject as jest.Mock
      mockGetObject.mockReturnValueOnce(pdf)

      await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should use the AWS S3 pdf', () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.CASE_DOCUMENTS,
        `Skjalaskrá ${policeCaseNumber}`,
        `Skjalaskrá ${policeCaseNumber}.pdf`,
        'application/pdf',
        pdf,
      )
    })
  })

  describe('pdf returned from AWS S3 indictment folder', () => {
    beforeEach(async () => {
      const mockGetObject = mockawsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(new Error('Some error'))
      mockGetObject.mockReturnValueOnce(pdf)

      await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should use the AWS S3 pdf', () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.CASE_DOCUMENTS,
        `Skjalaskrá ${policeCaseNumber}`,
        `Skjalaskrá ${policeCaseNumber}.pdf`,
        'application/pdf',
        pdf,
      )
    })
  })

  describe('police case number not in case', () => {
    const policeCaseNumber = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should return BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toEqual(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    })
  })

  describe('delivery to court fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockGet = createCaseFilesRecord as jest.Mock
      mockGet.mockResolvedValueOnce(pdf)

      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })

  describe('pdf generation fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should return a failure response', async () => {
      expect(then.result.delivered).toEqual(false)
    })
  })
})

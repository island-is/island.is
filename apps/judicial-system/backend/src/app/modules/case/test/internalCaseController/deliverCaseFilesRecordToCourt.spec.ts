import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { CaseState, CaseType, User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { createCaseFilesRecord } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case } from '../../../repository'
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
    type: CaseType.INDICTMENT,
    state: CaseState.COMPLETED,
    policeCaseNumbers: [policeCaseNumber],
    courtId,
    courtCaseNumber,
  } as Case
  const pdf = Buffer.from('test case files record')

  let mockAwsS3Service: AwsS3Service
  let mockCourtService: CourtService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, courtService, internalCaseController } =
      await createTestingCaseModule()

    mockAwsS3Service = awsS3Service
    const mockGetObject = mockAwsS3Service.getObject as jest.Mock
    mockGetObject.mockRejectedValue(new Error('Some error'))
    const mockPutObject = mockAwsS3Service.putObject as jest.Mock
    mockPutObject.mockRejectedValue(new Error('Some error'))

    const mockCreateCaseFilesRecord = createCaseFilesRecord as jest.Mock
    mockCreateCaseFilesRecord.mockRejectedValue(new Error('Some error'))

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
      const mockCreateCaseFilesRecord = createCaseFilesRecord as jest.Mock
      mockCreateCaseFilesRecord.mockResolvedValueOnce(pdf)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, policeCaseNumber, theCase)
    })

    it('should deliver the case files record', () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        theCase.type,
        `${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
      )
      expect(createCaseFilesRecord).toHaveBeenCalledWith(
        theCase,
        policeCaseNumber,
        [],
        expect.any(Function),
      )
      expect(mockAwsS3Service.putObject).toHaveBeenCalledWith(
        theCase.type,
        `${theCase.id}/${policeCaseNumber}/caseFilesRecord.pdf`,
        pdf.toString(),
      )
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
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('pdf returned from AWS S3', () => {
    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(pdf)

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
      const mockCreateCaseFilesRecord = createCaseFilesRecord as jest.Mock
      mockCreateCaseFilesRecord.mockResolvedValueOnce(pdf)

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

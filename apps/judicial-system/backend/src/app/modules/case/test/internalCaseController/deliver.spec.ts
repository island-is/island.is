import { uuid } from 'uuidv4'

import { CaseFileState } from '@island.is/judicial-system/types'

import { getCourtRecordPdfAsBuffer } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { CourtService } from '../../../court'
import { FileService } from '../../../file'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'
import { createTestingCaseModule } from '../createTestingCaseModule'

jest.mock('../../../../formatters/courtRecordPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver', () => {
  let mockCourtService: CourtService
  let mockFileService: FileService
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      courtService,
      fileService,
      awsS3Service,
      internalCaseController,
    } = await createTestingCaseModule()

    mockCourtService = courtService
    mockFileService = fileService
    mockAwsS3Service = awsS3Service

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliver(caseId, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  // Deliver signed ruling to court

  describe('get singed ruling', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase)
    })

    it('should get the signed ruling from S3', async () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(
        `generated/${caseId}/ruling.pdf`,
      )
    })
  })

  describe('create ruling', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const pdf = Buffer.from('test ruling')

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase)
    })

    it('should create a ruling at court', async () => {
      expect(mockCourtService.createRuling).toHaveBeenCalledWith(
        caseId,
        courtId,
        courtCaseNumber,
        'test',
        pdf,
        undefined,
      )
    })
  })

  // Deliver court record to court

  describe('court record generated', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(Buffer.from('test ruling'))

      await givenWhenThen(caseId, theCase)
    })

    it('should generate the court record', async () => {
      expect(getCourtRecordPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
    })
  })

  describe('create court record', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const pdf = Buffer.from('test court record')

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(Buffer.from('test ruling'))

      const mockGet = getCourtRecordPdfAsBuffer as jest.Mock
      mockGet.mockResolvedValueOnce(pdf)

      await givenWhenThen(caseId, theCase)
    })

    it('should create a court record at court', async () => {
      expect(mockCourtService.createCourtRecord).toHaveBeenCalledWith(
        caseId,
        courtId,
        courtCaseNumber,
        'test',
        pdf,
      )
    })
  })

  // Deliver case files to court

  describe('get case files', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(Buffer.from('test ruling'))

      await givenWhenThen(caseId, theCase)
    })

    it('should get all case files', () => {
      expect(mockFileService.getAllCaseFiles).toHaveBeenCalledWith(caseId)
    })
  })

  describe('files uploaded', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const caseFile1 = { id: uuid(), state: CaseFileState.STORED_IN_RVG }
    const caseFile2 = { id: uuid(), state: CaseFileState.STORED_IN_COURT }

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(Buffer.from('test ruling'))

      const mockGetAllCaseFiles = mockFileService.getAllCaseFiles as jest.Mock
      mockGetAllCaseFiles.mockResolvedValue([caseFile1, caseFile2])

      await givenWhenThen(caseId, theCase)
    })

    it('should upload the file stored in RVG', () => {
      expect(mockFileService.uploadCaseFileToCourt).toHaveBeenCalledWith(
        caseFile1,
        caseId,
        courtId,
        courtCaseNumber,
      )
    })

    it('should not upload the file stored in court', () => {
      expect(mockFileService.uploadCaseFileToCourt).not.toHaveBeenCalledWith(
        caseFile2,
        caseId,
        courtId,
        courtCaseNumber,
      )
    })
  })

  describe('success', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(Buffer.from('test ruling'))

      const mockGetAllCaseFiles = mockFileService.getAllCaseFiles as jest.Mock
      mockGetAllCaseFiles.mockResolvedValue([
        { id: uuid(), state: CaseFileState.STORED_IN_RVG },
      ])
      const mockUploadCaseFileToCourt = mockFileService.uploadCaseFileToCourt as jest.Mock
      mockUploadCaseFileToCourt.mockResolvedValueOnce({ success: true })

      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a success response', () => {
      expect(then.result.caseFilesDeliveredToCourt).toBe(true)
    })
  })

  describe('some case file is not uploaded', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(Buffer.from('test ruling'))

      const mockGetAllCaseFiles = mockFileService.getAllCaseFiles as jest.Mock
      mockGetAllCaseFiles.mockResolvedValue([
        { id: uuid(), state: CaseFileState.STORED_IN_RVG },
      ])
      const mockUploadCaseFileToCourt = mockFileService.uploadCaseFileToCourt as jest.Mock
      mockUploadCaseFileToCourt.mockResolvedValueOnce({ success: false })

      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', () => {
      expect(then.result.caseFilesDeliveredToCourt).toBe(false)
    })
  })

  describe('getting case files fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(Buffer.from('test ruling'))

      const mockGetAllCaseFiles = mockFileService.getAllCaseFiles as jest.Mock
      mockGetAllCaseFiles.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', () => {
      expect(then.result.caseFilesDeliveredToCourt).toBe(false)
    })
  })

  describe('uploading case files fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(Buffer.from('test ruling'))

      const mockGetAllCaseFiles = mockFileService.getAllCaseFiles as jest.Mock
      mockGetAllCaseFiles.mockResolvedValue([
        { id: uuid(), state: CaseFileState.STORED_IN_RVG },
      ])
      const mockUploadCaseFileToCourt = mockFileService.uploadCaseFileToCourt as jest.Mock
      mockUploadCaseFileToCourt.mockRejectedValue(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a failure response', () => {
      expect(then.result.caseFilesDeliveredToCourt).toBe(false)
    })
  })
})

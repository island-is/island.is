import { uuid } from 'uuidv4'

import {
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'
import {
  getCourtRecordPdfAsBuffer,
  getCourtRecordPdfAsString,
} from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { PoliceService } from '../../../police'
import { CaseFile, FileService } from '../../../file'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'

jest.mock('../../../../formatters/courtRecordPdf')

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver', () => {
  let mockCourtService: CourtService
  let mockPoliceService: PoliceService
  let mockFileService: FileService
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      courtService,
      policeService,
      fileService,
      awsS3Service,
      internalCaseController,
    } = await createTestingCaseModule()

    mockCourtService = courtService
    mockPoliceService = policeService
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

  describe('deliver R case', () => {
    beforeEach(() => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValue(new Error('Some error'))
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
        expect(then.result.rulingDeliveredToCourt).toEqual(true)
      })
    })

    describe('deliver court record to court', () => {
      const caseId = uuid()
      const courtId = uuid()
      const courtCaseNumber = uuid()
      const theCase = { id: caseId, courtId, courtCaseNumber } as Case
      const pdf = Buffer.from('test court record')
      let then: Then

      beforeEach(async () => {
        const mockGet = getCourtRecordPdfAsBuffer as jest.Mock
        mockGet.mockResolvedValueOnce(pdf)
        const mockCreateDocument = mockCourtService.createDocument as jest.Mock
        mockCreateDocument.mockResolvedValueOnce(uuid())

        then = await givenWhenThen(caseId, theCase)
      })

      it('should generate the court record', async () => {
        expect(getCourtRecordPdfAsBuffer).toHaveBeenCalledWith(
          theCase,
          expect.any(Function),
        )
      })

      it('should create a court record at court', async () => {
        expect(mockCourtService.createDocument).toHaveBeenCalledWith(
          caseId,
          courtId,
          courtCaseNumber,
          CourtDocumentFolder.COURT_DOCUMENTS,
          `Þingbók ${courtCaseNumber}`,
          `Þingbók ${courtCaseNumber}.pdf`,
          'application/pdf',
          pdf,
        )
      })

      it('should return a success response', async () => {
        expect(then.result.courtRecordDeliveredToCourt).toEqual(true)
      })
    })

    describe('deliver case files to court', () => {
      const caseId = uuid()
      const courtId = uuid()
      const courtCaseNumber = uuid()
      const caseFile1 = { id: uuid(), state: CaseFileState.STORED_IN_RVG }
      const caseFile2 = { id: uuid(), state: CaseFileState.STORED_IN_COURT }
      const theCase = {
        id: caseId,
        courtId,
        courtCaseNumber,
        caseFiles: [caseFile1, caseFile2],
      } as Case
      let then: Then

      beforeEach(async () => {
        const mockUploadCaseFileToCourt = mockFileService.uploadCaseFileToCourt as jest.Mock
        mockUploadCaseFileToCourt
          .mockResolvedValueOnce({ success: true })
          .mockResolvedValueOnce({ success: true })

        then = await givenWhenThen(caseId, theCase)
      })

      it('should upload files', () => {
        expect(mockFileService.uploadCaseFileToCourt).toHaveBeenCalledWith(
          caseFile1,
          theCase,
        )
        expect(mockFileService.uploadCaseFileToCourt).toHaveBeenCalledWith(
          caseFile2,
          theCase,
        )
      })

      it('should return a success response', () => {
        expect(then.result.caseFilesDeliveredToCourt).toBe(true)
      })
    })

    describe('some case file is not uploaded to court', () => {
      const caseId = uuid()
      const theCase = {
        id: caseId,
        caseFiles: [{ id: uuid(), state: CaseFileState.STORED_IN_RVG }],
      } as Case
      let then: Then

      beforeEach(async () => {
        const mockUploadCaseFileToCourt = mockFileService.uploadCaseFileToCourt as jest.Mock
        mockUploadCaseFileToCourt.mockResolvedValueOnce({ success: false })

        then = await givenWhenThen(caseId, theCase)
      })

      it('should return a failure response', () => {
        expect(then.result.caseFilesDeliveredToCourt).toBe(false)
      })
    })

    describe('uploading case files fails', () => {
      const caseId = uuid()
      const theCase = {
        id: caseId,
        caseFiles: [{ id: uuid(), state: CaseFileState.STORED_IN_RVG }],
      } as Case
      let then: Then

      beforeEach(async () => {
        const mockGetObject = mockAwsS3Service.getObject as jest.Mock
        mockGetObject.mockResolvedValueOnce(Buffer.from('test ruling'))
        const mockUploadCaseFileToCourt = mockFileService.uploadCaseFileToCourt as jest.Mock
        mockUploadCaseFileToCourt.mockRejectedValue(new Error('Some error'))

        then = await givenWhenThen(caseId, theCase)
      })

      it('should return a failure response', () => {
        expect(then.result.caseFilesDeliveredToCourt).toBe(false)
      })
    })

    describe('deliver case to police', () => {
      const caseId = uuid()
      const caseType = CaseType.CUSTODY
      const caseState = CaseState.ACCEPTED
      const policeCaseNumbers = [uuid()]
      const defendantNationalId = uuid()
      const caseConclusion = 'test conclusion'
      const theCase = {
        id: caseId,
        origin: CaseOrigin.LOKE,
        type: caseType,
        state: caseState,
        policeCaseNumbers,
        defendants: [{ nationalId: defendantNationalId }],
        conclusion: caseConclusion,
      } as Case
      const pdf = 'test court record'
      let then: Then

      beforeEach(async () => {
        const mockGet = getCourtRecordPdfAsString as jest.Mock
        mockGet.mockResolvedValueOnce(pdf)
        const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
        mockUpdatePoliceCase.mockResolvedValueOnce(true)

        then = await givenWhenThen(caseId, theCase)
      })

      it('should generate the court record string', async () => {
        expect(getCourtRecordPdfAsString).toHaveBeenCalledWith(
          theCase,
          expect.any(Function),
        )
      })

      it('should update the plice case', async () => {
        expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
          caseId,
          caseType,
          caseState,
          pdf,
          policeCaseNumbers,
          [defendantNationalId],
          caseConclusion,
        )
      })

      it('should return a success response', async () => {
        expect(then.result.caseDeliveredToPolice).toEqual(true)
      })
    })
  })

  describe('deliver S case', () => {
    const caseId = uuid()
    const caseType = CaseType.THEFT
    const caseState = CaseState.ACCEPTED
    const policeCaseNumbers = [uuid()]
    const defendantNationalId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const caseConclusion = 'test conclusion'
    const ruling = {
      category: CaseFileCategory.RULING,
    } as CaseFile
    const courtRecordKey = uuid()
    const courtRecord = {
      category: CaseFileCategory.COURT_RECORD,
      key: courtRecordKey,
    } as CaseFile
    const courtRecordPdf = Buffer.from('test court record')
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: caseType,
      state: caseState,
      courtId,
      courtCaseNumber,
      policeCaseNumbers,
      defendants: [{ nationalId: defendantNationalId }],
      conclusion: caseConclusion,
      caseFiles: [ruling, courtRecord],
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(courtRecordPdf)
      const mockUploadCaseFileToCourt = mockFileService.uploadCaseFileToCourt as jest.Mock
      mockUploadCaseFileToCourt.mockResolvedValue({ success: true })
      const mockUpdatePoliceCase = mockPoliceService.updatePoliceCase as jest.Mock
      mockUpdatePoliceCase.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase)
    })

    describe('no ruling delivered to court', () => {
      it('should return a success response', async () => {
        expect(then.result.rulingDeliveredToCourt).toEqual(true)
      })
    })

    describe('no court recort delivered to court', () => {
      it('should return a success response', async () => {
        expect(then.result.courtRecordDeliveredToCourt).toEqual(true)
      })
    })

    describe('no case files delivered but returns true', () => {
      it('should return a success response', async () => {
        expect(then.result.caseFilesDeliveredToCourt).toEqual(true)
      })
    })

    describe('deliver case to police', () => {
      it('should get the court record from S3', async () => {
        expect(mockAwsS3Service.getObject).toHaveBeenNthCalledWith(
          1,
          courtRecordKey,
        )
      })

      it('should update the plice case', async () => {
        expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
          caseId,
          caseType,
          caseState,
          'test court record',
          policeCaseNumbers,
          [defendantNationalId],
          caseConclusion,
        )
      })

      it('should return a success response', async () => {
        expect(then.result.caseDeliveredToPolice).toEqual(true)
      })
    })
  })
})

import { uuid } from 'uuidv4'

import {
  CaseFileCategory,
  CaseFileState,
  CaseOrigin,
  CaseState,
  CaseType,
  IndictmentSubType,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'
import { getCourtRecordPdfAsString } from '../../../../formatters'
import { AwsS3Service } from '../../../aws-s3'
import { PoliceService } from '../../../police'
import { CaseFile, FileService } from '../../../file'
import { Case } from '../../models/case.model'
import { DeliverCompletedCaseResponse } from '../../models/deliverCompletedCase.response'

jest.mock('../../../../formatters/courtRecordPdf')

interface Then {
  result: DeliverCompletedCaseResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver', () => {
  let mockPoliceService: PoliceService
  let mockFileService: FileService
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      policeService,
      fileService,
      awsS3Service,
      internalCaseController,
    } = await createTestingCaseModule()

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

  describe.each(Object.values(IndictmentSubType))(
    'deliver S case %s',
    (indictmentSubType) => {
      const caseId = uuid()
      const caseType = CaseType.INDICTMENT
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
        indictmentSubType,
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

        it('should update the police case', async () => {
          expect(mockPoliceService.updatePoliceCase).toHaveBeenCalledWith(
            caseId,
            indictmentSubType,
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
    },
  )
})

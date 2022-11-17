import { uuid } from 'uuidv4'

import { CaseFileCategory, CaseType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'
import { getRequestPdfAsBuffer } from '../../../../formatters'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { CaseFile, FileService } from '../../../file'
import { Case } from '../../models/case.model'
import { DeliverProsecutorDocumentsResponse } from '../../models/deliverProsecutorDocuments.response'

jest.mock('../../../../formatters/requestPdf')

interface Then {
  result?: DeliverProsecutorDocumentsResponse
  error?: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver prosecutor documents', () => {
  let mockCourtService: CourtService
  let mockFileService: FileService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      courtService,
      fileService,
      internalCaseController,
    } = await createTestingCaseModule()

    mockCourtService = courtService
    mockFileService = fileService

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then: Then = {}

      await internalCaseController
        .deliverProsecutorDocuments(caseId, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('deliver prosecutor docuements for R case', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      courtId,
      courtCaseNumber,
    } as Case
    const pdf = Buffer.from('test request')
    let then: Then

    beforeEach(async () => {
      const mockGet = getRequestPdfAsBuffer as jest.Mock
      mockGet.mockResolvedValueOnce(pdf)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(caseId, theCase)
    })

    it('should generate the request', async () => {
      expect(getRequestPdfAsBuffer).toHaveBeenCalledWith(
        theCase,
        expect.any(Function),
      )
    })

    it('should create a request at court', async () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.REQUEST_DOCUMENTS,
        `Krafa um gæsluvarðhald`,
        `Krafa um gæsluvarðhald.pdf`,
        'application/pdf',
        pdf,
      )
    })

    it('should return a success response', async () => {
      expect(then.result?.requestDeliveredToCourt).toEqual(true)
    })
  })

  describe('deliver prosecutor docuements for S case', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = uuid()
    const coverLetter = { category: CaseFileCategory.COVER_LETTER } as CaseFile
    const indictment = { category: CaseFileCategory.INDICTMENT } as CaseFile
    const criminalRecord = {
      category: CaseFileCategory.CRIMINAL_RECORD,
    } as CaseFile
    const coustBreakdown = {
      category: CaseFileCategory.COST_BREAKDOWN,
    } as CaseFile
    const caseFileContents = {
      category: CaseFileCategory.CASE_FILE_CONTENTS,
    } as CaseFile
    const caseFile = { category: CaseFileCategory.CASE_FILE } as CaseFile
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      courtId,
      courtCaseNumber,
      caseFiles: [
        coverLetter,
        indictment,
        criminalRecord,
        coustBreakdown,
        caseFileContents,
        caseFile,
      ],
    } as Case
    let then: Then

    beforeEach(async () => {
      const mockUploadCaseFileToCourt = mockFileService.uploadCaseFileToCourt as jest.Mock
      mockUploadCaseFileToCourt.mockResolvedValue({ success: true })

      then = await givenWhenThen(caseId, theCase)
    })

    it('should upload cover letter to court', async () => {
      expect(mockFileService.uploadCaseFileToCourt).toHaveBeenCalledWith(
        coverLetter,
        theCase,
      )
    })

    it('should upload indictment to court', async () => {
      expect(mockFileService.uploadCaseFileToCourt).toHaveBeenCalledWith(
        indictment,
        theCase,
      )
    })

    it('should upload criminal record to court', async () => {
      expect(mockFileService.uploadCaseFileToCourt).toHaveBeenCalledWith(
        criminalRecord,
        theCase,
      )
    })

    it('should upload cost breakdown to court', async () => {
      expect(mockFileService.uploadCaseFileToCourt).toHaveBeenCalledWith(
        coustBreakdown,
        theCase,
      )
    })

    it('should upload case file contents to court', async () => {
      expect(mockFileService.uploadCaseFileToCourt).toHaveBeenCalledWith(
        caseFileContents,
        theCase,
      )
    })

    it('should upload case file to court', async () => {
      expect(mockFileService.uploadCaseFileToCourt).toHaveBeenCalledWith(
        caseFile,
        theCase,
      )
    })

    it('should return a success response', async () => {
      expect(then.result?.requestDeliveredToCourt).toEqual(true)
    })
  })
})

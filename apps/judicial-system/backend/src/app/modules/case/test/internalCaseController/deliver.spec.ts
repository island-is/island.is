import { CaseFileState } from '@island.is/judicial-system/types'
import { uuid } from 'uuidv4'
import { FileService } from '../../../file'
import { Case } from '../../models/case.model'
import { DeliverResponse } from '../../models/deliver.response'
import { createTestingCaseModule } from '../createTestingCaseModule'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('InternalCaseController - Deliver', () => {
  let mockFileService: FileService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      fileService,
      internalCaseController,
    } = await createTestingCaseModule()

    mockFileService = fileService

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      await internalCaseController
        .deliver(caseId, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  // TODO: test signed ruling and court record delivery

  describe('get case files', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case

    beforeEach(async () => {
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

import { uuid } from 'uuidv4'

import { BadRequestException, NotFoundException } from '@nestjs/common'

import { CaseFileState } from '@island.is/judicial-system/types'

import { CourtService } from '../../court'
import { Case } from '../../case'
import { AwsS3Service } from '../../aws-S3'
import { CaseFile, UploadFileToCourtResponse } from '../models'
import { createTestingFileModule } from './createTestingFileModule'

interface Then {
  result: UploadFileToCourtResponse
  error: Error
}

type GivenWhenThen = (theCase: Case, caseFile: CaseFile) => Promise<Then>

describe('FileController - Upload case file to court', () => {
  let mockAwsS3Service: AwsS3Service
  let mockCourtService: CourtService
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      awsS3Service,
      courtService,
      fileModel,
      fileController,
    } = await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockCourtService = courtService
    mockFileModel = fileModel

    givenWhenThen = async (
      theCase: Case,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .uploadCaseFileToCourt(theCase, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('AWS S3 existance check', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
      key,
    } as CaseFile
    let mockObjectExists: jest.Mock

    beforeEach(async () => {
      mockObjectExists = mockAwsS3Service.objectExists as jest.Mock

      await givenWhenThen(theCase, caseFile)
    })

    it('should check if the file exists in AWS S3', () => {
      expect(mockObjectExists).toHaveBeenCalledWith(key)
    })
  })

  describe('AWS S3 get file', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
      key,
    } as CaseFile
    let mockGetObject: jest.Mock

    beforeEach(async () => {
      mockGetObject = mockAwsS3Service.getObject as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)

      await givenWhenThen(theCase, caseFile)
    })

    it('should get the file from AWS S3', () => {
      expect(mockGetObject).toHaveBeenCalledWith(key)
    })
  })

  describe('file upload to court', () => {
    const caseId = uuid()
    const courtId = uuid()
    const theCase = { id: caseId, courtId } as Case
    const fileId = uuid()
    const fileName = 'test.txt'
    const fileType = 'text/plain'
    const caseFile = {
      id: fileId,
      name: fileName,
      type: fileType,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    const content = Buffer.from('Test content')
    let mockUploadStream: jest.Mock

    beforeEach(async () => {
      mockUploadStream = mockCourtService.uploadStream as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)

      await givenWhenThen(theCase, caseFile)
    })

    it('should upload the file to court', () => {
      expect(mockUploadStream).toHaveBeenLastCalledWith(
        courtId,
        fileName,
        fileType,
        content,
      )
    })
  })

  describe('document creation at court', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = 'R-999/2021'
    const theCase = { id: caseId, courtId, courtCaseNumber } as Case
    const fileId = uuid()
    const fileName = 'test.txt'
    const caseFile = {
      id: fileId,
      name: fileName,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    const content = Buffer.from('Test content')
    const streamId = uuid()
    let mockCreateDocument: jest.Mock

    beforeEach(async () => {
      mockCreateDocument = mockCourtService.createDocument as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUploadStream = mockCourtService.uploadStream as jest.Mock
      mockUploadStream.mockResolvedValueOnce(streamId)

      await givenWhenThen(theCase, caseFile)
    })

    it('should create a document in court', () => {
      expect(mockCreateDocument).toHaveBeenCalledWith(
        courtId,
        courtCaseNumber,
        fileName,
        fileName,
        streamId,
      )
    })
  })

  describe('case file state update', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    const content = Buffer.from('Test content')
    const documentId = uuid()
    let mockUpdate: jest.Mock

    beforeEach(async () => {
      mockUpdate = mockFileModel.update as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(documentId)

      await givenWhenThen(theCase, caseFile)
    })

    it('should update case file state', () => {
      expect(mockUpdate).toHaveBeenCalledWith(
        { state: CaseFileState.STORED_IN_COURT, key: documentId },
        { where: { id: fileId } },
      )
    })
  })

  describe('AWS S3 delete file', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
      key,
    } as CaseFile
    const content = Buffer.from('Test content')
    let mockDeleteObject: jest.Mock

    beforeEach(async () => {
      mockDeleteObject = mockAwsS3Service.deleteObject as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      await givenWhenThen(theCase, caseFile)
    })

    it('should attempt to delete the file from AWS S3', () => {
      expect(mockDeleteObject).toHaveBeenCalledWith(key)
    })
  })

  describe('case file uploaded to court', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      then = await givenWhenThen(theCase, caseFile)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ success: true })
    })
  })

  describe('case file state not updated', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([0])

      then = await givenWhenThen(theCase, caseFile)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ success: false })
    })
  })

  describe('case file already uploaded to court', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_COURT,
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, caseFile)
    })

    it('should throw bad request exception', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `File ${fileId} has already been uploaded to court`,
      )
    })
  })

  describe('case file not stored in RVG', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, caseFile)
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `File ${fileId} does not exists in AWS S3`,
      )
    })
  })

  describe('file not found in AWS S3', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    let mockUpdate: jest.Mock
    let then: Then

    beforeEach(async () => {
      mockUpdate = mockFileModel.update as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(false)

      then = await givenWhenThen(theCase, caseFile)
    })

    it('should set as broken link', () => {
      expect(mockUpdate).toHaveBeenCalledWith(
        { state: CaseFileState.BOKEN_LINK },
        { where: { id: fileId } },
      )
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `File ${fileId} does not exists in AWS S3`,
      )
    })
  })

  describe('AWS S3 existence check fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('AWS S3 get file fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('file upload to court fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUploadStream = mockCourtService.uploadStream as jest.Mock
      mockUploadStream.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('document creation at court fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('case file state updated fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
    } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

import each from 'jest-each'
import { v4 as uuid } from 'uuid'

import { NotFoundException } from '@nestjs/common'

import {
  CaseFileCategory,
  CaseFileState,
  CaseType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case, CaseFile } from '../../../repository'
import { UploadFileToCourtResponse } from '../../models/uploadFileToCourt.response'

interface Then {
  result: UploadFileToCourtResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  fileId: string,
  user: User,
  theCase: Case,
  caseFile: CaseFile,
) => Promise<Then>

describe('FileController - Upload case file to court', () => {
  let mockAwsS3Service: AwsS3Service
  let mockCourtService: CourtService
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, courtService, fileModel, fileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockCourtService = courtService
    mockFileModel = fileModel

    givenWhenThen = async (
      caseId: string,
      fileId: string,
      user: User,
      theCase: Case,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .uploadCaseFileToCourt(caseId, fileId, user, theCase, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('AWS S3 existance check', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
    } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile

    beforeEach(async () => {
      await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should check if the file exists in AWS S3', () => {
      expect(mockAwsS3Service.objectExists).toHaveBeenCalledWith(
        theCase.type,
        key,
      )
    })
  })

  describe('AWS S3 get file', () => {
    const user = {} as User
    const caseId = uuid()
    const type = CaseType.INDICTMENT
    const theCase = { id: caseId, type } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)

      await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should get the file from AWS S3', () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(type, key)
    })
  })

  describe('file upload to court', () => {
    const user = { id: uuid() } as User
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = 'R-999/2021'
    const theCase = {
      id: caseId,
      courtId,
      courtCaseNumber,
    } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const fileName = 'test.txt'
    const fileType = 'text/plain'
    const caseFile = {
      id: fileId,
      key,
      isKeyAccessible: true,
      name: fileName,
      type: fileType,
    } as CaseFile
    const content = Buffer.from('Test content')
    let mockCreateDocument: jest.Mock

    beforeEach(async () => {
      mockCreateDocument = mockCourtService.createDocument as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)

      await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should upload the file to court', () => {
      expect(mockCreateDocument).toHaveBeenCalledWith(
        user,
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.CASE_DOCUMENTS,
        fileName,
        fileName,
        fileType,
        content,
      )
    })
  })

  each`
    caseFileCategory                       | courtDocumentFolder
    ${CaseFileCategory.COURT_RECORD}       | ${CourtDocumentFolder.COURT_DOCUMENTS}
    ${CaseFileCategory.RULING}             | ${CourtDocumentFolder.COURT_DOCUMENTS}
    ${CaseFileCategory.CRIMINAL_RECORD}    | ${CourtDocumentFolder.CASE_DOCUMENTS}
    ${CaseFileCategory.COST_BREAKDOWN}     | ${CourtDocumentFolder.CASE_DOCUMENTS}
    ${CaseFileCategory.CASE_FILE}          | ${CourtDocumentFolder.CASE_DOCUMENTS}
    `.describe(
    'indictment file upload to court',
    ({ caseFileCategory, courtDocumentFolder }) => {
      const user = { id: uuid() } as User
      const caseId = uuid()
      const courtId = uuid()
      const courtCaseNumber = 'R-999/2021'
      const theCase = {
        id: caseId,
        courtId,
        courtCaseNumber,
      } as Case
      const fileId = uuid()
      const key = `${caseId}/${uuid()}/test.txt`
      const fileName = 'test.txt'
      const fileType = 'text/plain'
      const caseFile = {
        id: fileId,
        key,
        isKeyAccessible: true,
        name: fileName,
        type: fileType,
        category: caseFileCategory,
      } as CaseFile
      const content = Buffer.from('Test content')
      let mockCreateDocument: jest.Mock

      beforeEach(async () => {
        mockCreateDocument = mockCourtService.createDocument as jest.Mock
        const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
        mockObjectExists.mockResolvedValueOnce(true)
        const mockGetObject = mockAwsS3Service.getObject as jest.Mock
        mockGetObject.mockResolvedValueOnce(content)

        await givenWhenThen(caseId, fileId, user, theCase, caseFile)
      })

      it('should upload the file to court', () => {
        expect(mockCreateDocument).toHaveBeenCalledWith(
          user,
          caseId,
          courtId,
          courtCaseNumber,
          courtDocumentFolder,
          fileName,
          fileName,
          fileType,
          content,
        )
      })
    },
  )

  describe('case file state update', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const content = Buffer.from('Test content')
    const documentId = uuid()

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(documentId)

      await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should update case file state', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        { state: CaseFileState.STORED_IN_COURT },
        { where: { id: fileId } },
      )
    })
  })

  describe('case file uploaded to court', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      then = await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ success: true })
    })
  })

  describe('case file state not updated', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([0])

      then = await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ success: false })
    })
  })

  describe('case file already uploaded to court', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_COURT,
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ success: true })
    })
  })

  describe('case file not stored in RVG', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`File ${fileId} does not exist in AWS S3`)
    })
  })

  describe('file not found in AWS S3', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(false)

      then = await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should set isKeyAccessible to false', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        { isKeyAccessible: false },
        { where: { id: fileId } },
      )
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`File ${fileId} does not exist in AWS S3`)
    })
  })

  describe('AWS S3 existence check fails', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('AWS S3 get file fails', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('file upload to court fails', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('case file state updated fails', () => {
    const user = {} as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, user, theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

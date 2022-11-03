import each from 'jest-each'
import { uuid } from 'uuidv4'

import { NotFoundException } from '@nestjs/common'

import {
  CaseFileCategory,
  CaseFileState,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'
import { AwsS3Service } from '../../../aws-s3'
import { CourtDocumentFolder, CourtService } from '../../../court'
import { Case } from '../../../case'
import { CaseFile } from '../../models/file.model'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  fileId: string,
  theCase: Case,
  caseFile: CaseFile,
) => Promise<Then>

describe('InternalFileController - Deliver case file to court', () => {
  let mockAwsS3Service: AwsS3Service
  let mockCourtService: CourtService
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      awsS3Service,
      courtService,
      fileModel,
      internalFileController,
    } = await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockCourtService = courtService
    mockFileModel = fileModel

    givenWhenThen = async (
      caseId: string,
      fileId: string,
      theCase: Case,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await internalFileController
        .deliverCaseFileToCourt(caseId, fileId, theCase, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case file delivered', () => {
    const caseId = uuid()
    const courtId = uuid()
    const courtCaseNumber = 'R-999/2021'
    const theCase = {
      id: caseId,
      courtId,
      courtCaseNumber,
    } as Case
    const fileId = uuid()
    const key = `uploads/${caseId}/${uuid()}/test.txt`
    const fileName = 'test.txt'
    const fileType = 'text/plain'
    const caseFile = {
      id: fileId,
      key,
      name: fileName,
      type: fileType,
    } as CaseFile
    const content = Buffer.from('Test content')
    const documentId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockResolvedValueOnce(documentId)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
    })

    it('should check if the file exists in AWS S3', () => {
      expect(mockAwsS3Service.objectExists).toHaveBeenCalledWith(key)
    })

    it('should get the file from AWS S3', () => {
      expect(mockAwsS3Service.getObject).toHaveBeenCalledWith(key)
    })

    it('should upload the file to court', () => {
      expect(mockCourtService.createDocument).toHaveBeenCalledWith(
        caseId,
        courtId,
        courtCaseNumber,
        CourtDocumentFolder.CASE_DOCUMENTS,
        fileName,
        fileName,
        fileType,
        content,
        undefined,
      )
    })

    it('should update case file state', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        { state: CaseFileState.STORED_IN_COURT },
        { where: { id: fileId } },
      )
    })

    it('should return success', () => {
      expect(then.result).toEqual({ delivered: true })
    })
  })

  each`
    caseFileCategory                       | fileName             | courtDocumentFolder
    ${CaseFileCategory.COURT_RECORD}       | ${'Þingbók'}        | ${
    CourtDocumentFolder.COURT_DOCUMENTS
  }
    ${CaseFileCategory.RULING}             | ${'Dómur'}          | ${
    CourtDocumentFolder.COURT_DOCUMENTS
  }
    ${CaseFileCategory.COVER_LETTER}       | ${'Fylgibréf'}      | ${
    CourtDocumentFolder.INDICTMENT_DOCUMENTS
  }
    ${CaseFileCategory.INDICTMENT}         | ${'Ákæra'}          | ${
    CourtDocumentFolder.INDICTMENT_DOCUMENTS
  }
    ${CaseFileCategory.CRIMINAL_RECORD}    | ${'Sakavottorð'}    | ${
    CourtDocumentFolder.INDICTMENT_DOCUMENTS
  }
    ${CaseFileCategory.COST_BREAKDOWN}     | ${'Sakarkostnaður'} | ${
    CourtDocumentFolder.INDICTMENT_DOCUMENTS
  }
    ${CaseFileCategory.CASE_FILE_CONTENTS} | ${'Skjalaskrá'}     | ${
    CourtDocumentFolder.CASE_DOCUMENTS
  }
    ${CaseFileCategory.CASE_FILE}          | ${'Málsgögn'}       | ${
    CourtDocumentFolder.CASE_DOCUMENTS
  }
    `.describe(
    'indictment file upload to court',
    ({ caseFileCategory, fileName, courtDocumentFolder }) => {
      const caseId = uuid()
      const courtId = uuid()
      const courtCaseNumber = 'R-999/2021'
      const theCase = {
        id: caseId,
        courtId,
        courtCaseNumber,
      } as Case
      const fileId = uuid()
      const key = `uploads/${caseId}/${uuid()}/test.txt`
      const fileType = 'text/plain'
      const caseFile = {
        id: fileId,
        key,
        name: 'SomeName.txt',
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

        await givenWhenThen(caseId, fileId, theCase, caseFile)
      })

      it('should upload the file to court', () => {
        expect(mockCreateDocument).toHaveBeenCalledWith(
          caseId,
          courtId,
          courtCaseNumber,
          courtDocumentFolder,
          `${fileName} ${courtCaseNumber}`,
          `${fileName} ${courtCaseNumber}.txt`,
          fileType,
          content,
          undefined,
        )
      })
    },
  )

  describe('case file state not updated', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `uploads/${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([0])

      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ delivered: false })
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
      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('case file not stored in RVG', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
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
    const key = `uploads/${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(false)

      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
    })

    it('should remove the key', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        { key: null },
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
    const key = `uploads/${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
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
    const key = `uploads/${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
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
    const key = `uploads/${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockCreateDocument = mockCourtService.createDocument as jest.Mock
      mockCreateDocument.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
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
    const key = `uploads/${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const content = Buffer.from('Test content')
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetObject = mockAwsS3Service.getObject as jest.Mock
      mockGetObject.mockResolvedValueOnce(content)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

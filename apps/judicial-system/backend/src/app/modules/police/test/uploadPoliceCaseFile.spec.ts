import fetch from 'isomorphic-fetch'
import { Base64 } from 'js-base64'
import { v4 as uuid } from 'uuid'

import { BadGatewayException, NotFoundException } from '@nestjs/common'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { AwsS3Service } from '../../aws-s3'
import { Case, CaseRepositoryService } from '../../repository'
import { UploadPoliceCaseFileDto } from '../dto/uploadPoliceCaseFile.dto'
import { UploadPoliceCaseFileResponse } from '../models/uploadPoliceCaseFile.response'
import { PoliceController } from '../police.controller'

jest.mock('isomorphic-fetch')

interface Then {
  result: UploadPoliceCaseFileResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  caseType: CaseType,
  user: User,
  uploadPoliceCaseFile: UploadPoliceCaseFileDto,
) => Promise<Then>

const documentListUrl = (caseId: string) =>
  expect.stringMatching(new RegExp(`.*/GetDocumentListById/${caseId}$`))

const documentUrl = (policeFileId: string) =>
  expect.stringMatching(new RegExp(`.*/GetPDFDocumentByID/${policeFileId}$`))

const anyDocumentUrl = expect.stringMatching(/.*\/GetPDFDocumentByID\/.*/)

const documentListResponse = (policeFileIds: string[]) => ({
  ok: true,
  json: async () => ({
    malsnumer: '000-0000-0000',
    skjol: policeFileIds.map((policeFileId) => ({
      rvMalSkjolMals_ID: Number(policeFileId),
      heitiSkjals: `Name ${policeFileId}`,
      malsnumer: '000-0000-0000',
    })),
  }),
})

const documentResponse = () => ({
  ok: true,
  json: () => Base64.btoa('Test content'),
})

describe('PoliceController - Upload police case file', () => {
  const mockFetch = fetch as jest.Mock
  let mockAwsS3Service: AwsS3Service
  let mockCaseRepositoryService: CaseRepositoryService
  let policeController: PoliceController
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    mockFetch.mockReset()

    const testingModule = await createTestingPoliceModule()

    mockAwsS3Service = testingModule.awsS3Service
    mockCaseRepositoryService = testingModule.caseRepositoryService
    policeController = testingModule.policeController

    const mockPutObject = mockAwsS3Service.putObject as jest.Mock
    mockPutObject.mockReset()
    mockPutObject.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      caseId: string,
      caseType: CaseType,
      user: User,
      uploadPoliceCaseFile: UploadPoliceCaseFileDto,
    ): Promise<Then> => {
      const then = {} as Then

      await policeController
        .uploadPoliceCaseFile(caseId, user, uploadPoliceCaseFile, {
          id: caseId,
          type: caseType,
        } as Case)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe.each([CaseType.CUSTODY, CaseType.INDICTMENT])(
    '%s case file uploaded to AWS S3',
    (caseType) => {
      const caseId = uuid()
      const user = { id: uuid() } as User
      const policeFileId = '1001'
      const fileName = 'test.txt'
      const uploadPoliceCaseFile = {
        id: policeFileId,
        name: fileName,
      } as UploadPoliceCaseFileDto
      const key = uuid()
      let then: Then

      beforeEach(async () => {
        mockFetch
          .mockResolvedValueOnce(documentListResponse(['1000', policeFileId]))
          .mockResolvedValueOnce(documentResponse())
        const mockPutObject = mockAwsS3Service.putObject as jest.Mock
        mockPutObject.mockResolvedValueOnce(key)

        then = await givenWhenThen(caseId, caseType, user, uploadPoliceCaseFile)
      })

      it('should upload the file to AWS S3', () => {
        expect(fetch).toHaveBeenNthCalledWith(
          1,
          documentListUrl(caseId),
          expect.anything(),
        )
        expect(fetch).toHaveBeenNthCalledWith(
          2,
          documentUrl(policeFileId),
          expect.anything(),
        )
        expect(mockAwsS3Service.putObject).toHaveBeenCalledWith(
          caseType,
          expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
          'Test content',
        )
        expect(then.result).toEqual({
          key: expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
          size: 12,
        })
      })
    },
  )

  describe('police file is not in the document list of the case', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = '2001'
    const uploadPoliceCaseFile = {
      id: policeFileId,
      name: 'test.pdf',
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
      mockFetch
        .mockResolvedValueOnce(documentListResponse(['2000', '2002']))
        .mockResolvedValueOnce(documentResponse())

      then = await givenWhenThen(
        caseId,
        CaseType.CUSTODY,
        user,
        uploadPoliceCaseFile,
      )
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Police case file ${policeFileId} of case ${caseId} not found`,
      )
    })

    it('should not request the document', () => {
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        documentListUrl(caseId),
        expect.anything(),
      )
      expect(fetch).not.toHaveBeenCalledWith(anyDocumentUrl, expect.anything())
    })

    it('should not store anything', () => {
      expect(mockAwsS3Service.putObject).not.toHaveBeenCalled()
    })
  })

  describe('case has an original ancestor', () => {
    const caseId = uuid()
    const originalAncestorCaseId = uuid()
    const user = {} as User
    const policeFileId = '3001'
    const uploadPoliceCaseFile = {
      id: policeFileId,
      name: 'test.pdf',
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
      const mockFindOriginalAncestorId =
        mockCaseRepositoryService.findOriginalAncestorId as jest.Mock
      mockFindOriginalAncestorId.mockResolvedValueOnce(originalAncestorCaseId)
      mockFetch
        .mockResolvedValueOnce(documentListResponse([policeFileId]))
        .mockResolvedValueOnce(documentResponse())
      const mockPutObject = mockAwsS3Service.putObject as jest.Mock
      mockPutObject.mockResolvedValueOnce(uuid())

      then = await givenWhenThen(
        caseId,
        CaseType.CUSTODY,
        user,
        uploadPoliceCaseFile,
      )
    })

    it('should check the document list of the original ancestor', () => {
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        documentListUrl(originalAncestorCaseId),
        expect.anything(),
      )
    })

    it('should store the file with the case', () => {
      expect(then.result.key).toMatch(new RegExp(`^${caseId}/.{36}/test.pdf$`))
    })
  })

  describe('several police files uploaded at once', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileIds = ['4001', '4002', '4003']
    let thens: Then[]

    beforeEach(async () => {
      mockFetch
        .mockResolvedValueOnce(documentListResponse(policeFileIds))
        .mockResolvedValue(documentResponse())
      const mockPutObject = mockAwsS3Service.putObject as jest.Mock
      mockPutObject.mockResolvedValue(uuid())

      thens = await Promise.all(
        policeFileIds.map((policeFileId) =>
          givenWhenThen(caseId, CaseType.INDICTMENT, user, {
            id: policeFileId,
            name: `${policeFileId}.pdf`,
          } as UploadPoliceCaseFileDto),
        ),
      )
    })

    it('should upload all the files', () => {
      expect(thens.map((then) => then.error)).toEqual([
        undefined,
        undefined,
        undefined,
      ])
      expect(mockAwsS3Service.putObject).toHaveBeenCalledTimes(3)
    })

    it('should request the document list once', () => {
      expect(fetch).toHaveBeenCalledTimes(4)
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        documentListUrl(caseId),
        expect.anything(),
      )
      for (const [index, policeFileId] of policeFileIds.entries()) {
        expect(fetch).toHaveBeenNthCalledWith(
          index + 2,
          documentUrl(policeFileId),
          expect.anything(),
        )
      }
    })
  })

  describe('document list already fetched for the case', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = '5001'
    let then: Then

    beforeEach(async () => {
      mockFetch
        .mockResolvedValueOnce(documentListResponse([policeFileId]))
        .mockResolvedValueOnce(documentResponse())
      const mockPutObject = mockAwsS3Service.putObject as jest.Mock
      mockPutObject.mockResolvedValueOnce(uuid())

      await policeController.getAll(caseId, user, { id: caseId } as Case)

      then = await givenWhenThen(caseId, CaseType.CUSTODY, user, {
        id: policeFileId,
        name: 'test.pdf',
      } as UploadPoliceCaseFileDto)
    })

    it('should upload the file without requesting the list again', () => {
      expect(then.error).toBeUndefined()
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        documentUrl(policeFileId),
        expect.anything(),
      )
    })
  })

  describe('police file added to the case after the list was fetched', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = '6002'
    let then: Then

    beforeEach(async () => {
      mockFetch
        .mockResolvedValueOnce(documentListResponse(['6001']))
        .mockResolvedValueOnce(documentListResponse(['6001', policeFileId]))
        .mockResolvedValueOnce(documentResponse())
      const mockPutObject = mockAwsS3Service.putObject as jest.Mock
      mockPutObject.mockResolvedValueOnce(uuid())

      await policeController.getAll(caseId, user, { id: caseId } as Case)

      then = await givenWhenThen(caseId, CaseType.CUSTODY, user, {
        id: policeFileId,
        name: 'test.pdf',
      } as UploadPoliceCaseFileDto)
    })

    it('should request the list again and upload the file', () => {
      expect(then.error).toBeUndefined()
      expect(fetch).toHaveBeenCalledTimes(3)
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        documentListUrl(caseId),
        expect.anything(),
      )
    })
  })

  describe('document list fetched a long time ago', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = '7001'
    let then: Then

    beforeEach(async () => {
      mockFetch
        .mockResolvedValueOnce(documentListResponse([policeFileId]))
        .mockResolvedValueOnce(documentListResponse([]))
        .mockResolvedValueOnce(documentResponse())

      await policeController.getAll(caseId, user, { id: caseId } as Case)

      const now = Date.now()
      const mockNow = jest.spyOn(Date, 'now')
      mockNow.mockReturnValue(now + 60 * 60 * 1000)

      then = await givenWhenThen(caseId, CaseType.CUSTODY, user, {
        id: policeFileId,
        name: 'test.pdf',
      } as UploadPoliceCaseFileDto)

      mockNow.mockRestore()
    })

    it('should check the current document list', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        documentListUrl(caseId),
        expect.anything(),
      )
      expect(mockAwsS3Service.putObject).not.toHaveBeenCalled()
    })
  })

  describe('remote police document list call fails', () => {
    const caseId = uuid()
    const user = {} as User
    const uploadPoliceCaseFile = {
      id: '8001',
      name: 'test.pdf',
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
      mockFetch.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(
        caseId,
        CaseType.BANKING_SECRECY_WAIVER,
        user,
        uploadPoliceCaseFile,
      )
    })

    it('should throw bad gateway exception', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe(
        `Failed to get police case files for case ${caseId}`,
      )
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('remote police document call fails', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = '8002'
    const uploadPoliceCaseFile = {
      id: policeFileId,
      name: 'test.pdf',
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
      mockFetch
        .mockResolvedValueOnce(documentListResponse([policeFileId]))
        .mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(
        caseId,
        CaseType.BANKING_SECRECY_WAIVER,
        user,
        uploadPoliceCaseFile,
      )
    })

    it('should throw bad gateway exception', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe(
        `Failed to get police case file ${policeFileId} of case ${caseId}`,
      )
    })
  })

  describe('police file not found', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = '8003'
    const policeCaseFile = {
      id: policeFileId,
      name: 'test.pdf',
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
      mockFetch
        .mockResolvedValueOnce(documentListResponse([policeFileId]))
        .mockResolvedValueOnce({ ok: false, text: () => 'Some error' })

      then = await givenWhenThen(
        caseId,
        CaseType.SEARCH_WARRANT,
        user,
        policeCaseFile,
      )
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Police case file ${policeFileId} of case ${caseId} not found`,
      )
    })
  })

  describe('remote AWS S3 call fails', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = '8004'
    const uploadPoliceCaseFile = {
      id: policeFileId,
      name: 'test.pdf',
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
      mockFetch
        .mockResolvedValueOnce(documentListResponse([policeFileId]))
        .mockResolvedValueOnce(documentResponse())

      then = await givenWhenThen(
        caseId,
        CaseType.TELECOMMUNICATIONS,
        user,
        uploadPoliceCaseFile,
      )
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe(`Some error`)
    })
  })
})

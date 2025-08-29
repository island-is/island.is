import fetch from 'isomorphic-fetch'
import { Base64 } from 'js-base64'
import { uuid } from 'uuidv4'

import { BadGatewayException, NotFoundException } from '@nestjs/common'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { AwsS3Service } from '../../aws-s3'
import { Case } from '../../repository'
import { UploadPoliceCaseFileDto } from '../dto/uploadPoliceCaseFile.dto'
import { UploadPoliceCaseFileResponse } from '../models/uploadPoliceCaseFile.response'

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

describe('PoliceController - Upload police case file', () => {
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, policeController } = await createTestingPoliceModule()

    mockAwsS3Service = awsS3Service

    const mockPutObject = mockAwsS3Service.putObject as jest.Mock
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

  describe('file uploaded to AWS S3', () => {
    const caseId = uuid()
    const user = { id: uuid() } as User
    const policeFileId = uuid()
    const fileName = 'test.txt'
    const uploadPoliceCaseFile = {
      id: policeFileId,
      name: fileName,
    } as UploadPoliceCaseFileDto
    const key = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Base64.btoa('Test content'),
      })
      const mockPutObject = mockAwsS3Service.putObject as jest.Mock
      mockPutObject.mockResolvedValueOnce(key)

      then = await givenWhenThen(
        caseId,
        CaseType.CUSTODY,
        user,
        uploadPoliceCaseFile,
      )
    })

    it('should updload the file to ASW S3', () => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`.*/GetPDFDocumentByID/${policeFileId}`),
        ),
        expect.anything(),
      )
      expect(mockAwsS3Service.putObject).toHaveBeenCalledWith(
        CaseType.CUSTODY,
        expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
        'Test content',
      )
      expect(then.result).toEqual({
        key: expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
        size: 12,
      })
    })
  })

  describe('indictment case file uploaded to AWS S3', () => {
    const caseId = uuid()
    const user = { id: uuid() } as User
    const policeFileId = uuid()
    const fileName = 'test.txt'
    const uploadPoliceCaseFile = {
      id: policeFileId,
      name: fileName,
    } as UploadPoliceCaseFileDto
    const key = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Base64.btoa('Test content'),
      })
      const mockPutObject = mockAwsS3Service.putObject as jest.Mock
      mockPutObject.mockResolvedValueOnce(key)

      then = await givenWhenThen(
        caseId,
        CaseType.INDICTMENT,
        user,
        uploadPoliceCaseFile,
      )
    })

    it('should updload the file to ASW S3', () => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`.*/GetPDFDocumentByID/${policeFileId}`),
        ),
        expect.anything(),
      )
      expect(mockAwsS3Service.putObject).toHaveBeenCalledWith(
        CaseType.INDICTMENT,
        expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
        'Test content',
      )
      expect(then.result).toEqual({
        key: expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
        size: 12,
      })
    })
  })

  describe('remote police call fails', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = uuid()
    const uploadPoliceCaseFile = {
      id: policeFileId,
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
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
        `Failed to get police case file ${uploadPoliceCaseFile.id} of case ${caseId}`,
      )
    })
  })

  describe('police file not found', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = uuid()
    const policeCaseFile = {
      id: policeFileId,
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({ ok: false, text: () => 'Some error' })

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
    const policeFileId = uuid()
    const uploadPoliceCaseFile = {
      id: policeFileId,
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Base64.btoa('Test content'),
      })

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

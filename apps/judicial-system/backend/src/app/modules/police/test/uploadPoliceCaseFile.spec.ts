import fetch from 'isomorphic-fetch'
import { Base64 } from 'js-base64'
import { uuid } from 'uuidv4'

import { BadGatewayException, NotFoundException } from '@nestjs/common'

import { CaseType, User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { AwsS3Service } from '../../aws-s3'
import { Case } from '../../case'
import { UploadPoliceCaseFileDto } from '../dto/uploadPoliceCaseFile.dto'
import { UploadPoliceCaseFileResponse } from '../models/uploadPoliceCaseFile.response'

jest.mock('isomorphic-fetch')

interface Then {
  result: UploadPoliceCaseFileResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  uploadPoliceCaseFile: UploadPoliceCaseFileDto,
) => Promise<Then>

describe('PoliceController - Upload police case file', () => {
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, policeController } = await createTestingPoliceModule()

    mockAwsS3Service = awsS3Service

    givenWhenThen = async (
      caseId: string,
      user: User,
      uploadPoliceCaseFile: UploadPoliceCaseFileDto,
    ): Promise<Then> => {
      const then = {} as Then

      await policeController
        .uploadPoliceCaseFile(caseId, user, uploadPoliceCaseFile, {
          type: CaseType.CUSTODY,
        } as Case)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('remote police call', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = uuid()
    const uploadPoliceCaseFile = {
      id: policeFileId,
    } as UploadPoliceCaseFileDto

    beforeEach(async () => {
      await givenWhenThen(caseId, user, uploadPoliceCaseFile)
    })

    it('should get the police file', () => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`.*/GetPDFDocumentByID/${policeFileId}`),
        ),
        expect.anything(),
      )
    })
  })

  describe('remote AWS S3 call', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = uuid()
    const fileName = 'test.txt'
    const uploadPoliceCaseFile = {
      id: policeFileId,
      name: fileName,
    } as UploadPoliceCaseFileDto
    let mockPutObject: jest.Mock

    beforeEach(async () => {
      mockPutObject = mockAwsS3Service.putObject as jest.Mock
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Base64.btoa('Test content'),
      })

      await givenWhenThen(caseId, user, uploadPoliceCaseFile)
    })

    it('should updload the file to ASW S3', () => {
      expect(mockPutObject).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`^uploads/${caseId}/.{36}/test.txt$`)),
        'Test content',
      )
    })
  })

  describe('file uploaded to AWS S3', () => {
    const caseId = uuid()
    const user = {} as User
    const policeFileId = uuid()
    const fileName = 'test.txt'
    const uploadPoliceCaseFile = {
      id: policeFileId,
      name: fileName,
    } as UploadPoliceCaseFileDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Base64.btoa('Test content'),
      })

      then = await givenWhenThen(caseId, user, uploadPoliceCaseFile)
    })

    it('should updload the file to ASW S3', () => {
      expect(then.result).toEqual({
        key: expect.stringMatching(
          new RegExp(`^uploads/${caseId}/.{36}/test.txt$`),
        ),
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
      const mockFetch = fetch as jest.Mock
      mockFetch.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, uploadPoliceCaseFile)
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

      then = await givenWhenThen(caseId, user, policeCaseFile)
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
      const mockPutObject = mockAwsS3Service.putObject as jest.Mock
      mockPutObject.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, user, uploadPoliceCaseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe(`Some error`)
    })
  })
})

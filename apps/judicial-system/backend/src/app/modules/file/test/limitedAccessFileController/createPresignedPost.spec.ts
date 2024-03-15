import { uuid } from 'uuidv4'

import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../../case'
import { CreatePresignedPostDto } from '../../dto/createPresignedPost.dto'
import { PresignedPost } from '../../models/presignedPost.model'

interface Then {
  result: PresignedPost
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  createPresignedPost: CreatePresignedPostDto,
  theCase: Case,
) => Promise<Then>

describe('LimitedAccesslimitedAccessFileController - Create presigned post', () => {
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, limitedAccessFileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service

    givenWhenThen = async (
      caseId: string,
      createPresignedPost: CreatePresignedPostDto,
      theCase: Case,
    ): Promise<Then> => {
      const then = {} as Then

      await limitedAccessFileController
        .createPresignedPost(caseId, theCase, createPresignedPost)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'presigned post created for %s case',
    (type) => {
      const caseId = uuid()
      const theCase = { id: caseId, type } as Case
      const createPresignedPost: CreatePresignedPostDto = {
        fileName: 'test.txt',
        type: 'text/plain',
      }
      let then: Then

      beforeEach(async () => {
        const mockCreatePresignedPost =
          mockAwsS3Service.createPresignedPost as jest.Mock
        mockCreatePresignedPost.mockImplementationOnce((key: string) =>
          Promise.resolve({
            url: 'https://s3.eu-west-1.amazonaws.com/island-is-dev-upload-judicial-system',
            fields: {
              key,
              bucket: 'island-is-dev-upload-judicial-system',
              'X-Amz-Algorithm': 'Some Algorithm',
              'X-Amz-Credential': 'Some Credentials',
              'X-Amz-Date': 'Some Date',
              'X-Amz-Security-Token': 'Some Token',
              Policy: 'Some Policy',
              'X-Amz-Signature': 'Some Signature',
            },
          }),
        )

        then = await givenWhenThen(caseId, createPresignedPost, theCase)
      })

      it('should request a presigned post from AWS S3', () => {
        expect(mockAwsS3Service.createPresignedPost).toHaveBeenCalledWith(
          expect.stringMatching(
            new RegExp(`^uploads/${caseId}/.{36}/test.txt$`),
          ),
          'text/plain',
        )
      })

      it('should return a presigned post', () => {
        expect(then.result).toEqual({
          url: 'https://s3.eu-west-1.amazonaws.com/island-is-dev-upload-judicial-system',
          fields: {
            key: then.result.fields.key,
            bucket: 'island-is-dev-upload-judicial-system',
            'X-Amz-Algorithm': 'Some Algorithm',
            'X-Amz-Credential': 'Some Credentials',
            'X-Amz-Date': 'Some Date',
            'X-Amz-Security-Token': 'Some Token',
            Policy: 'Some Policy',
            'X-Amz-Signature': 'Some Signature',
          },
        })

        expect(then.result.fields.key).toMatch(
          new RegExp(`^uploads/${caseId}/.{36}/test.txt$`),
        )
      })
    },
  )

  describe.each(indictmentCases)(
    'presigned post created for %s case',
    (type) => {
      const caseId = uuid()
      const theCase = { id: caseId, type } as Case
      const createPresignedPost: CreatePresignedPostDto = {
        fileName: 'test.txt',
        type: 'text/plain',
      }
      let then: Then

      beforeEach(async () => {
        const mockCreatePresignedPost =
          mockAwsS3Service.createPresignedPost as jest.Mock
        mockCreatePresignedPost.mockImplementationOnce((key: string) =>
          Promise.resolve({
            url: 'https://s3.eu-west-1.amazonaws.com/island-is-dev-upload-judicial-system',
            fields: {
              key,
              bucket: 'island-is-dev-upload-judicial-system',
              'X-Amz-Algorithm': 'Some Algorithm',
              'X-Amz-Credential': 'Some Credentials',
              'X-Amz-Date': 'Some Date',
              'X-Amz-Security-Token': 'Some Token',
              Policy: 'Some Policy',
              'X-Amz-Signature': 'Some Signature',
            },
          }),
        )

        then = await givenWhenThen(caseId, createPresignedPost, theCase)
      })

      it('should request a presigned post from AWS S3', () => {
        expect(mockAwsS3Service.createPresignedPost).toHaveBeenCalledWith(
          expect.stringMatching(
            new RegExp(`^indictments/${caseId}/.{36}/test.txt$`),
          ),
          'text/plain',
        )
      })

      it('should return a presigned post', () => {
        expect(then.result).toEqual({
          url: 'https://s3.eu-west-1.amazonaws.com/island-is-dev-upload-judicial-system',
          fields: {
            key: then.result.fields.key,
            bucket: 'island-is-dev-upload-judicial-system',
            'X-Amz-Algorithm': 'Some Algorithm',
            'X-Amz-Credential': 'Some Credentials',
            'X-Amz-Date': 'Some Date',
            'X-Amz-Security-Token': 'Some Token',
            Policy: 'Some Policy',
            'X-Amz-Signature': 'Some Signature',
          },
        })

        expect(then.result.fields.key).toMatch(
          new RegExp(`^indictments/${caseId}/.{36}/test.txt$`),
        )
      })
    },
  )

  describe('remote call fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const createPresignedPost: CreatePresignedPostDto = {
      fileName: 'test.txt',
      type: 'text/plain',
    }
    let then: Then

    beforeEach(async () => {
      const mockCreatePresignedPost =
        mockAwsS3Service.createPresignedPost as jest.Mock
      mockCreatePresignedPost.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, createPresignedPost, theCase)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe(`Some error`)
    })
  })
})

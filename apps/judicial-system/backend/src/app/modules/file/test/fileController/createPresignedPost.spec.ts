import { uuid } from 'uuidv4'

import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case } from '../../../repository'
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

describe('FileController - Create presigned post', () => {
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, fileController } = await createTestingFileModule()

    mockAwsS3Service = awsS3Service

    givenWhenThen = async (
      caseId: string,
      createPresignedPost: CreatePresignedPostDto,
      theCase: Case,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
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
        mockCreatePresignedPost.mockImplementationOnce((_1, key: string) =>
          Promise.resolve({
            url: 'https://s3.eu-west-1.amazonaws.com/island-is-dev-upload-judicial-system',
            fields: {
              key: `uploads/${key}`,
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

      it('should return a presigned post', () => {
        expect(mockAwsS3Service.createPresignedPost).toHaveBeenCalledWith(
          type,
          expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
          'text/plain',
        )

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
          key: expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
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
      const theCase = {
        id: caseId,
        type,
      } as Case
      const createPresignedPost: CreatePresignedPostDto = {
        fileName: 'test.txt',
        type: 'text/plain',
      }
      let then: Then

      beforeEach(async () => {
        const mockCreatePresignedPost =
          mockAwsS3Service.createPresignedPost as jest.Mock
        mockCreatePresignedPost.mockImplementationOnce((_1, key: string) =>
          Promise.resolve({
            url: 'https://s3.eu-west-1.amazonaws.com/island-is-dev-upload-judicial-system',
            fields: {
              key: `indictments/${key}`,
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

      it('should return a presigned post', () => {
        expect(mockAwsS3Service.createPresignedPost).toHaveBeenCalledWith(
          type,
          expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
          'text/plain',
        )

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
          key: expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
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

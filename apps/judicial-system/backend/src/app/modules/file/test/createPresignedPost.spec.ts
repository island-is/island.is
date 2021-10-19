import { uuid } from 'uuidv4'

import { Case } from '../../case'
import { AwsS3Service } from '../awsS3.service'
import { CreatePresignedPostDto } from '../dto'
import { PresignedPost } from '../models'
import { createTestingFileModule } from './createTestingFileModule'

interface Then {
  result: PresignedPost
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  createPresignedPost: CreatePresignedPostDto,
) => Promise<Then>

describe('FileController - Create presigned post', () => {
  let mockAwsS3Service: AwsS3Service
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, fileController } = await createTestingFileModule()

    mockAwsS3Service = awsS3Service

    givenWhenThen = async (
      theCase: Case,
      createPresignedPost: CreatePresignedPostDto,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .createPresignedPost(theCase, createPresignedPost)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('remote call', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const createPresignedPost: CreatePresignedPostDto = {
      fileName: 'test.txt',
      type: 'text/plain',
    }
    let mockCreatePresignedPost: jest.SpyInstance<
      Promise<PresignedPost>,
      [key: string, type: string]
    >

    beforeEach(async () => {
      mockCreatePresignedPost = jest.spyOn(
        mockAwsS3Service,
        'createPresignedPost',
      )

      await givenWhenThen(theCase, createPresignedPost)
    })

    it('should request a presigned post', () => {
      expect(mockCreatePresignedPost).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`^${caseId}/.{36}/test.txt$`)),
        'text/plain',
      )
    })
  })

  describe('presigned post created', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const createPresignedPost: CreatePresignedPostDto = {
      fileName: 'test.txt',
      type: 'text/plain',
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, createPresignedPost)
    })

    it('should return a presogned post', () => {
      expect(then.result).toEqual({
        url:
          'https://s3.eu-west-1.amazonaws.com/island-is-dev-upload-judicial-system',
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
        new RegExp(`^${caseId}/.{36}/test.txt$`),
      )
    })
  })

  describe('remote call fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const createPresignedPost: CreatePresignedPostDto = {
      fileName: 'test.txt',
      type: 'text/plain',
    }
    let then: Then

    beforeEach(async () => {
      jest
        .spyOn(mockAwsS3Service, 'createPresignedPost')
        .mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase, createPresignedPost)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe(`Some error`)
    })
  })
})

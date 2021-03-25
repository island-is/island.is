import { uuid } from 'uuidv4'

import { Test } from '@nestjs/testing'

import { User } from '@island.is/judicial-system/types'
import { LoggingModule } from '@island.is/logging'

import { Case, CaseService } from '../case'
import { AwsS3Service } from './awsS3.service'
import { FileService } from './file.service'
import { FileController } from './file.controller'

describe('FileModule', () => {
  let caseService: CaseService
  let fileController: FileController

  const mockCreatePresignedPost = jest.fn((key) => ({
    url:
      'https://s3.eu-west-1.amazonaws.com/island-is-dev-upload-judicial-system',
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
  }))

  beforeEach(async () => {
    const fileModule = await Test.createTestingModule({
      imports: [LoggingModule],
      controllers: [FileController],
      providers: [
        FileService,
        {
          provide: CaseService,
          useClass: jest.fn(() => ({
            findByIdAndUser: () => ({}),
          })),
        },
        {
          provide: AwsS3Service,
          useClass: jest.fn(() => ({
            createPresignedPost: mockCreatePresignedPost,
          })),
        },
      ],
    }).compile()

    caseService = fileModule.get<CaseService>(CaseService)
    fileController = fileModule.get<FileController>(FileController)
  })

  describe('Given a case', () => {
    const caseId = uuid()
    const user = {} as User
    const fileName = 'test.txt'

    beforeEach(() => {
      jest
        .spyOn(caseService, 'findByIdAndUser')
        .mockImplementation((id: string, _: User) =>
          Promise.resolve({ id } as Case),
        )
    })

    it('should create a presigned post', async () => {
      const presignedPost = await fileController.createPresignedPost(
        caseId,
        user,
        { fileName },
      )

      expect(presignedPost).toStrictEqual({
        url:
          'https://s3.eu-west-1.amazonaws.com/island-is-dev-upload-judicial-system',
        fields: {
          key: presignedPost.fields.key,
          bucket: 'island-is-dev-upload-judicial-system',
          'X-Amz-Algorithm': 'Some Algorithm',
          'X-Amz-Credential': 'Some Credentials',
          'X-Amz-Date': 'Some Date',
          'X-Amz-Security-Token': 'Some Token',
          Policy: 'Some Policy',
          'X-Amz-Signature': 'Some Signature',
        },
      })

      expect(presignedPost.fields.key).toMatch(
        new RegExp(`${caseId}/.{36}_${fileName}`),
      )

      expect(mockCreatePresignedPost).toHaveBeenCalledTimes(1)
      expect(mockCreatePresignedPost).toHaveBeenCalledWith(
        presignedPost.fields.key,
      )
    })
  })
})

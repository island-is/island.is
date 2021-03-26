import { uuid } from 'uuidv4'

import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { User } from '@island.is/judicial-system/types'
import { LoggingModule } from '@island.is/logging'

import { Case, CaseService } from '../case'
import { AwsS3Service } from './awsS3.service'
import { File } from './models'
import { FileService } from './file.service'
import { FileController } from './file.controller'

describe('FileModule', () => {
  let fileModel: { create: jest.Mock }
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
    fileModel = {
      create: jest.fn(),
    }

    const fileModule = await Test.createTestingModule({
      imports: [LoggingModule],
      controllers: [FileController],
      providers: [
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
        {
          provide: getModelToken(File),
          useValue: fileModel,
        },
        FileService,
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
        new RegExp(`^${caseId}/.{36}_${fileName}$`),
      )

      expect(mockCreatePresignedPost).toHaveBeenCalledTimes(1)
      expect(mockCreatePresignedPost).toHaveBeenCalledWith(
        presignedPost.fields.key,
      )
    })

    it('should create a file', async () => {
      const id = uuid()
      const timeStamp = new Date()
      const size = 99999

      fileModel.create.mockImplementation((values: object) =>
        Promise.resolve({
          ...values,
          id,
          created: timeStamp,
          modified: timeStamp,
        }),
      )

      const presignedPost = await fileController.createPresignedPost(
        caseId,
        user,
        { fileName },
      )

      const file = await fileController.createFile(caseId, user, {
        key: presignedPost.fields.key,
        size,
      })

      expect(file).toStrictEqual({
        id,
        created: timeStamp,
        modified: timeStamp,
        caseId,
        name: fileName,
        key: presignedPost.fields.key,
        size,
      })
    })
  })
})

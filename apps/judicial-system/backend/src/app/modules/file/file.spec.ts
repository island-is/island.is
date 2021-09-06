import { uuid } from 'uuidv4'

import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { NotFoundException } from '@nestjs/common'

import { UserRole } from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'
import { LoggingModule } from '@island.is/logging'

import { Case, CaseService } from '../case'
import { AwsS3Service } from './awsS3.service'
import { CaseFile } from './models'
import { FileService } from './file.service'
import { FileController } from './file.controller'

describe('FileModule', () => {
  let fileModel: {
    create: jest.Mock
    findAll: jest.Mock
    findByPk: jest.Mock
    destroy: jest.Mock
  }
  let awsS3Service: AwsS3Service
  let fileController: FileController

  beforeEach(async () => {
    fileModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      destroy: jest.fn(),
    }

    const fileModule = await Test.createTestingModule({
      imports: [LoggingModule],
      controllers: [FileController],
      providers: [
        {
          provide: CaseService,
          useClass: jest.fn(() => ({
            findByIdAndUser: (id: string, _: User) =>
              Promise.resolve({ id } as Case),
          })),
        },
        {
          provide: AwsS3Service,
          useClass: jest.fn(() => ({
            createPresignedPost: (key: string) =>
              Promise.resolve({
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
              }),
            deleteObject: () => Promise.resolve(true),
            getSignedUrl: () => Promise.resolve({}),
            objectExists: () => Promise.resolve(true),
          })),
        },
        {
          provide: getModelToken(CaseFile),
          useValue: fileModel,
        },
        FileService,
      ],
    }).compile()

    awsS3Service = fileModule.get<AwsS3Service>(AwsS3Service)
    fileController = fileModule.get<FileController>(FileController)
  })

  describe('Given a case', () => {
    const caseId = uuid()
    const user = { role: UserRole.PROSECUTOR } as User
    const fileName = 'test.txt'

    it('should create a presigned post', async () => {
      const presignedPost = await fileController.createCasePresignedPost(
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
        new RegExp(`^${caseId}/.{36}/${fileName}$`),
      )
    })

    it('should create a file', async () => {
      const id = uuid()
      const timeStamp = new Date()
      const size = 99999

      fileModel.create.mockImplementation(
        (values: { key: string; size: number; caseId: string; name: string }) =>
          Promise.resolve({
            ...values,
            id,
            created: timeStamp,
            modified: timeStamp,
          }),
      )

      const presignedPost = await fileController.createCasePresignedPost(
        caseId,
        user,
        { fileName },
      )

      const file = await fileController.createCaseFile(caseId, user, {
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

    describe('Given some files', () => {
      const mockFiles = [{ id: uuid() }, { id: uuid() }]

      beforeEach(() => {
        fileModel.findAll.mockReturnValueOnce(Promise.resolve(mockFiles))
      })

      it('should get all the files', async () => {
        const files = await fileController.getAllCaseFiles(caseId, user)

        expect(files).toStrictEqual(mockFiles)

        expect(fileModel.findAll).toHaveBeenCalledWith({
          where: { caseId },
          order: [['created', 'DESC']],
        })
      })
    })

    describe('Given a file', () => {
      const fileId = uuid()
      const key = `${caseId}/${fileId}/${fileName}`
      const mockFile = {
        id: fileId,
        caseId,
        key,
      }

      beforeEach(() => {
        fileModel.findByPk.mockImplementation((id: string) =>
          Promise.resolve(id === fileId ? mockFile : null),
        )
      })

      it('should delete the file', async () => {
        fileModel.destroy.mockReturnValue(Promise.resolve(1))
        const mockDeleteObject = jest.spyOn(awsS3Service, 'deleteObject')

        const { success } = await fileController.deleteCaseFile(
          caseId,
          fileId,
          user,
        )

        expect(success).toBe(true)

        expect(fileModel.destroy).toHaveBeenCalledWith({
          where: { id: fileId },
        })

        expect(mockDeleteObject).toHaveBeenCalledTimes(1)
        expect(mockDeleteObject).toHaveBeenCalledWith(key)
      })

      it('should get a presigned url', async () => {
        const mockUrl = uuid()
        const mockGetSignedUrl = jest.spyOn(awsS3Service, 'getSignedUrl')
        mockGetSignedUrl.mockReturnValueOnce(Promise.resolve({ url: mockUrl }))

        const { url } = await fileController.getCaseFileSignedUrl(
          caseId,
          fileId,
          user,
        )

        expect(url).toBe(mockUrl)

        expect(mockGetSignedUrl).toHaveBeenCalledTimes(1)
        expect(mockGetSignedUrl).toHaveBeenCalledWith(key)
      })

      it('should throw when getting a presigned url for a file that does not exist in AWS S3', async () => {
        const mockObjectExists = jest.spyOn(awsS3Service, 'objectExists')
        mockObjectExists.mockReturnValueOnce(Promise.resolve(false))

        await expect(
          fileController.getCaseFileSignedUrl(caseId, fileId, user),
        ).rejects.toThrow(NotFoundException)
      })
    })
  })
})

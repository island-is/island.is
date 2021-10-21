import { uuid } from 'uuidv4'
import { Op } from 'sequelize'
import each from 'jest-each'

import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { ForbiddenException, NotFoundException } from '@nestjs/common'

import {
  CaseFileState,
  CaseState,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'
import { LoggingModule } from '@island.is/logging'

import { Case, CaseService } from '../case'
import { CourtService } from '../court'
import { AwsS3Service } from './awsS3.service'
import { CaseFile } from './models'
import { FileService } from './file.service'
import { FileController } from './file.controller'

describe('FileController', () => {
  let fileModel: {
    create: jest.Mock
    findAll: jest.Mock
    findOne: jest.Mock
    update: jest.Mock
  }
  let caseService: CaseService
  let courtService: CourtService
  let awsS3Service: AwsS3Service
  let fileController: FileController

  beforeEach(async () => {
    fileModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
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
          provide: CourtService,
          useClass: jest.fn(() => ({
            uploadStream: jest.fn(),
            createDocument: jest.fn(),
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
            getSignedUrl: jest.fn(),
            objectExists: () => Promise.resolve(true),
            getObject: () => jest.fn(),
          })),
        },
        {
          provide: getModelToken(CaseFile),
          useValue: fileModel,
        },
        FileService,
      ],
    }).compile()

    caseService = fileModule.get<CaseService>(CaseService)
    courtService = fileModule.get<CourtService>(CourtService)
    awsS3Service = fileModule.get<AwsS3Service>(AwsS3Service)
    fileController = fileModule.get<FileController>(FileController)
  })

  describe('when uploading a case file to court', () => {
    // RolesGuard blocks access for non court roles. Also, mockFindByIdAndUser
    // blocks access for some roles to some cases. This is not relevant in
    // this test.

    each`
      state                  | role
      ${CaseState.ACCEPTED}  | ${UserRole.REGISTRAR}
      ${CaseState.ACCEPTED}  | ${UserRole.JUDGE}
      ${CaseState.REJECTED}  | ${UserRole.REGISTRAR}
      ${CaseState.REJECTED}  | ${UserRole.JUDGE}
      ${CaseState.DISMISSED} | ${UserRole.REGISTRAR}
      ${CaseState.DISMISSED} | ${UserRole.JUDGE}
    `.describe(
      'given a $state case and a permitted $role user',
      ({ state, role }) => {
        const caseId = uuid()
        const courtId = uuid()
        const courtCaseNumber = uuid()
        const user = { id: uuid(), role } as User

        beforeEach(() => {
          const mockFindByIdAndUser = jest.spyOn(caseService, 'findByIdAndUser')
          mockFindByIdAndUser.mockImplementation((id: string) =>
            Promise.resolve({
              id,
              state,
              courtId,
              courtCaseNumber,
            } as Case),
          )
        })

        describe('given a case file', () => {
          const fileId = uuid()
          const fileName = 'test.txt'
          const type = 'text/plain'
          const key = `${caseId}/${fileId}/${fileName}`
          const mockFile = {
            id: fileId,
            caseId,
            name: fileName,
            type,
            key,
          }

          beforeEach(() => {
            fileModel.findOne.mockResolvedValueOnce(mockFile)
          })

          it('should upload a case file to court', async () => {
            const mockBuffer = Buffer.from(uuid())
            const mockGetObject = jest.spyOn(awsS3Service, 'getObject')
            mockGetObject.mockResolvedValueOnce(mockBuffer)

            const mockStreamId = uuid()
            const mockUploadStream = jest.spyOn(courtService, 'uploadStream')
            mockUploadStream.mockResolvedValueOnce(mockStreamId)

            const mockDocumentId = uuid()
            const mockCreateDocument = jest.spyOn(
              courtService,
              'createDocument',
            )
            mockCreateDocument.mockResolvedValueOnce(mockDocumentId)

            fileModel.update.mockResolvedValueOnce([1])
            const mockDeleteObject = jest.spyOn(awsS3Service, 'deleteObject')

            const { success } = await fileController.uploadCaseFileToCourt(
              caseId,
              fileId,
              user,
            )

            expect(fileModel.findOne).toHaveBeenCalledWith({
              where: {
                id: fileId,
                caseId,
                state: { [Op.not]: CaseFileState.DELETED },
              },
            })

            expect(mockGetObject).toHaveBeenCalledWith(key)

            expect(mockUploadStream).toHaveBeenCalledWith(
              courtId,
              fileName,
              type,
              mockBuffer,
            )

            expect(mockCreateDocument).toHaveBeenCalledWith(
              courtId,
              courtCaseNumber,
              fileName,
              fileName,
              mockStreamId,
            )

            expect(fileModel.update).toHaveBeenCalledWith(
              {
                state: CaseFileState.STORED_IN_COURT,
                key: mockDocumentId,
              },
              { where: { id: fileId } },
            )

            expect(mockDeleteObject).toHaveBeenCalledWith(key)

            expect(success).toBe(true)
          })

          it('should throw when uploading a case file to court and the file does not exist in AWS S3', async () => {
            const mockObjectExists = jest.spyOn(awsS3Service, 'objectExists')
            mockObjectExists.mockResolvedValueOnce(false)

            await expect(
              fileController.uploadCaseFileToCourt(caseId, fileId, user),
            ).rejects.toThrow(NotFoundException)

            expect(fileModel.update).toHaveBeenCalledWith(
              { state: CaseFileState.BOKEN_LINK },
              { where: { id: fileId } },
            )
          })
        })

        describe('given a broken link case file', () => {
          const fileId = uuid()
          const key = `${caseId}/${fileId}/test.txt`
          const mockFile = {
            id: fileId,
            caseId,
            state: CaseFileState.BOKEN_LINK,
            key,
          }

          beforeEach(() => {
            fileModel.findOne.mockResolvedValueOnce(mockFile)
          })

          it('should throw when uploading a case file to court', async () => {
            await expect(
              fileController.uploadCaseFileToCourt(caseId, fileId, user),
            ).rejects.toThrow(NotFoundException)
          })
        })

        describe('given an already uploaded case file', () => {
          const fileId = uuid()
          const key = `${caseId}/${fileId}/test.txt`
          const mockFile = {
            id: fileId,
            caseId,
            state: CaseFileState.STORED_IN_COURT,
            key,
          }

          beforeEach(() => {
            fileModel.findOne.mockResolvedValueOnce(mockFile)
          })

          it('should throw when uploading a case file to court', async () => {
            await expect(
              fileController.uploadCaseFileToCourt(caseId, fileId, user),
            ).rejects.toThrow(ForbiddenException)
          })
        })

        describe('given a non-existing (or deleted) case file', () => {
          const fileId = uuid()

          beforeEach(() => {
            fileModel.findOne.mockResolvedValueOnce(null)
          })

          it('should throw when uploading a case file to court', async () => {
            await expect(
              fileController.uploadCaseFileToCourt(caseId, fileId, user),
            ).rejects.toThrow(NotFoundException)
          })
        })
      },
    )

    each`
      state                  | role
      ${CaseState.NEW}       | ${UserRole.REGISTRAR}
      ${CaseState.NEW}       | ${UserRole.JUDGE}
      ${CaseState.DRAFT}     | ${UserRole.REGISTRAR}
      ${CaseState.DRAFT}     | ${UserRole.JUDGE}
      ${CaseState.SUBMITTED} | ${UserRole.REGISTRAR}
      ${CaseState.SUBMITTED} | ${UserRole.JUDGE}
      ${CaseState.RECEIVED}  | ${UserRole.REGISTRAR}
      ${CaseState.RECEIVED}  | ${UserRole.JUDGE}
    `.describe(
      'given a $state case and a blocked $role user',
      ({ state, role }) => {
        const caseId = uuid()
        const user = { id: uuid(), role } as User

        beforeEach(() => {
          const mockFindByIdAndUser = jest.spyOn(caseService, 'findByIdAndUser')
          mockFindByIdAndUser.mockImplementation((id: string) =>
            Promise.resolve({ id, state } as Case),
          )
        })

        it('should throw when uploading a case file to court', async () => {
          const fileId = uuid()

          await expect(
            fileController.uploadCaseFileToCourt(caseId, fileId, user),
          ).rejects.toThrow(ForbiddenException)
        })
      },
    )

    describe('given a non-existing (or blocked) case', () => {
      const caseId = uuid()

      beforeEach(() => {
        const mockFindByIdAndUser = jest.spyOn(caseService, 'findByIdAndUser')
        mockFindByIdAndUser.mockRejectedValueOnce(new Error('Some error'))
      })

      it('should throw when uploading a case file to court', async () => {
        const prosecutor = {} as User
        const fileId = uuid()

        await expect(
          fileController.uploadCaseFileToCourt(caseId, fileId, prosecutor),
        ).rejects.toThrow('Some error')
      })
    })
  })
})

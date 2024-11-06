import { Test } from '@nestjs/testing'
import { FileService } from './file.service'
import {
  SigningModule,
  signingModuleConfig,
  SigningService,
} from '@island.is/dokobit-signing'
import { AwsModule, S3Service } from '@island.is/nest/aws'
import { Application } from '@island.is/application/api/core'
import { ApplicationTypes, PdfTypes } from '@island.is/application/types'
import { LoggingModule } from '@island.is/logging'
import { defineConfig, ConfigModule } from '@island.is/nest/config'
import { FileStorageConfig } from '@island.is/file-storage'

describe('FileService', () => {
  let service: FileService
  let signingService: SigningService
  let s3Service: S3Service
  const signingServiceRequestSignatureResponse = {
    controlCode: 'code',
    documentToken: 'token',
  }

  const bucket = 'test-bucket'
  const ApplicationFilesConfig = defineConfig({
    name: 'ApplicationFilesModule',
    load: () => ({
      attachmentBucket: bucket,
      presignBucket: bucket,
      redis: {
        nodes: 'nodes',
        ssl: false,
      },
    }),
  })

  const applicationId = '1111-2222-3333-4444'

  const parentB = {
    id: 'id',
    fullName: 'parent b',
    nationalId: '0022993322',
    address: {
      postalCode: '101',
      streetName: 'Borgartún',
      city: 'Reykjavík',
    },
  }

  const parentBWithContactInfo = {
    ...parentB,
    phoneNumber: '222-1111',
    email: 'email2@email2.is',
  }

  const child = {
    fullName: 'child',
    nationalId: '1234567890',
    otherParent: parentB,
  }

  const parentA = {
    nationalId: '0113215029',
    fullName: 'Test name',
    children: [child],
  }

  const parentAWithContactInfo = {
    ...parentA,
    phoneNumber: '111-2222',
    email: 'email@email.is',
  }

  const createApplication = (answers?: object, typeId?: string) =>
    ({
      id: applicationId,
      state: 'draft',
      applicant: parentA.nationalId,
      assignees: [],
      typeId: typeId ?? ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2,
      modified: new Date(),
      created: new Date(),
      attachments: {},
      answers: answers ?? {
        useMocks: 'no',
        selectedChildren: [child.nationalId],
        parentA: {
          phoneNumber: parentAWithContactInfo.phoneNumber,
          email: parentAWithContactInfo.email,
        },
        parentB: {
          email: parentBWithContactInfo.email,
          phoneNumber: parentBWithContactInfo.phoneNumber,
        },
        expiry: 'permanent',
      },
      externalData: {
        nationalRegistry: {
          data: { ...parentA },
          status: 'success',
          date: new Date().toISOString(),
        },
        childrenCustodyInformation: {
          data: [child],
          status: 'success',
          date: new Date().toISOString(),
        },
      },
    } as unknown as Application)

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        LoggingModule,
        SigningModule,
        AwsModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            signingModuleConfig,
            ApplicationFilesConfig,
            FileStorageConfig,
          ],
        }),
      ],
      providers: [FileService],
    }).compile()

    s3Service = module.get(S3Service)

    jest
      .spyOn(s3Service, 'getFileContent')
      .mockImplementation(() => Promise.resolve('body'))

    jest.spyOn(s3Service, 'fileExists').mockResolvedValue(false)

    jest
      .spyOn(s3Service, 'uploadFile')
      .mockImplementation(() => Promise.resolve('url'))

    jest
      .spyOn(s3Service, 'getPresignedUrl')
      .mockImplementation(() => Promise.resolve('url'))

    signingService = module.get(SigningService)

    jest
      .spyOn(signingService, 'requestSignature')
      .mockImplementation(() =>
        Promise.resolve(signingServiceRequestSignatureResponse),
      )

    service = module.get(FileService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  it('should return presigned url', async () => {
    const application = createApplication()
    const fileName = `children-residence-change/${application.id}.pdf`

    const result = await service.getPresignedUrl(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    expect(s3Service.getPresignedUrl).toHaveBeenCalledWith({
      bucket,
      key: fileName,
    })
    expect(result).toEqual('url')
  })

  it('should throw error for uploadSignedFile since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.uploadSignedFile(
        application,
        'token',
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    await expect(act).rejects.toThrow(
      'Application type is not supported in file service.',
    )
  })

  it('should have an application type that is valid for uploadSignedFile', async () => {
    const application = createApplication()

    const act = async () =>
      await service.uploadSignedFile(
        application,
        'token',
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    await expect(act).resolves
  })

  it('should throw error for getPresignedUrl since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.getPresignedUrl(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    await expect(act).rejects.toThrow(
      'Application type is not supported in file service.',
    )
  })

  it('Should properly delete a file from s3', async () => {
    const application = createApplication()
    const result = await service.deleteAttachmentsForApplication(application)
    expect(s3Service.deleteObject).toHaveBeenCalled()
    expect(result).toEqual({
      failed: {},
      success: true,
      deleted: 1,
    })
  })
})

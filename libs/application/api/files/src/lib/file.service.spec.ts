import { Test } from '@nestjs/testing'
import { FileService } from './file.service'
import {
  SigningModule,
  signingModuleConfig,
  SigningService,
} from '@island.is/dokobit-signing'
import { AwsService } from '@island.is/nest/aws'
import * as pdf from './pdfGenerators'
import { LoggingModule } from '@island.is/logging'
import { defineConfig, ConfigModule } from '@island.is/nest/config'
import { FileStorageConfig } from '@island.is/file-storage'

describe('FileService', () => {
  let service: FileService
  let signingService: SigningService
  let awsService: AwsService
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

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        LoggingModule,
        SigningModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            signingModuleConfig,
            ApplicationFilesConfig,
            FileStorageConfig,
          ],
        }),
      ],
      providers: [FileService, AwsService],
    }).compile()

    awsService = module.get(AwsService)

    jest
      .spyOn(awsService, 'getFile')
      .mockImplementation(() => Promise.resolve({ Body: 'body' }))

    jest.spyOn(awsService, 'fileExists').mockResolvedValue(false)

    jest
      .spyOn(awsService, 'uploadFile')
      .mockImplementation(() => Promise.resolve('url'))

    jest
      .spyOn(awsService, 'getPresignedUrl')
      .mockImplementation(() => Promise.resolve('url'))

    jest
      .spyOn(pdf, 'generateResidenceChangePdf')
      .mockImplementation(() => Promise.resolve(Buffer.from('buffer')))

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
})

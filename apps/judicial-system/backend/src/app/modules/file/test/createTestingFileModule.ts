import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { CourtService } from '../../court'
import { CaseService } from '../../case'
import { CaseFile } from '../models'
import { FileService } from '../file.service'
import { FileController } from '../file.controller'
import { AwsS3Service } from '../awsS3.service'

export const createTestingFileModule = async () => {
  const fileModule = await Test.createTestingModule({
    imports: [
      LoggingModule,
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
    ],
    controllers: [FileController],
    providers: [
      {
        provide: CaseService,
        useClass: jest.fn(() => ({})),
      },
      {
        provide: CourtService,
        useClass: jest.fn(() => ({})),
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
        })),
      },
      {
        provide: getModelToken(CaseFile),
        useValue: jest.fn(() => ({})),
      },
      FileService,
    ],
  }).compile()

  const awsS3Service = fileModule.get<AwsS3Service>(AwsS3Service)
  const fileController = fileModule.get<FileController>(FileController)

  return { awsS3Service, fileController }
}

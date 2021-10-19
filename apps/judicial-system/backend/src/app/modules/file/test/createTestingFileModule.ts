import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { CourtService } from '../../court'
import { CaseService } from '../../case'
import { CaseFile } from '../models'
import { AwsS3Service } from '../awsS3.service'
import { FileService } from '../file.service'
import { FileController } from '../file.controller'

jest.mock('../../court/court.service.ts')
jest.mock('../../case/case.service.ts')

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
      CaseService,
      CourtService,
      {
        provide: AwsS3Service,
        useClass: jest.fn(() => ({
          createPresignedPost: jest.fn(async () => ({})),
        })),
      },
      {
        provide: getModelToken(CaseFile),
        useValue: { create: jest.fn(), findAll: jest.fn() },
      },
      FileService,
    ],
  }).compile()

  const awsS3Service = fileModule.get<AwsS3Service>(AwsS3Service)
  const fileModel = await fileModule.resolve<typeof CaseFile>(
    getModelToken(CaseFile),
  )
  const fileController = fileModule.get<FileController>(FileController)

  return { awsS3Service, fileModel, fileController }
}

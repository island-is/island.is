import { Sequelize } from 'sequelize-typescript'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { AwsS3Service } from '../../aws-s3'
import { CaseService, PdfService } from '../../case'
import {
  AppealEventLogRepositoryService,
  AppealSummonsRepositoryService,
} from '../../repository'
import { AppealSummonsController } from '../appealSummons.controller'
import { AppealSummonsService } from '../appealSummons.service'

jest.mock('../../case/pdf.service')
jest.mock('../../case/case.service')
jest.mock('../../aws-s3/awsS3.service')
jest.mock('../../repository/services/appealSummonsRepository.service')
jest.mock('../../repository/services/appealEventLogRepository.service')

export const createTestingAppealSummonsModule = async () => {
  const appealSummonsModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig],
      }),
    ],
    controllers: [AppealSummonsController],
    providers: [
      SharedAuthModule,
      CaseService,
      PdfService,
      AwsS3Service,
      AppealSummonsRepositoryService,
      AppealEventLogRepositoryService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
      AppealSummonsService,
    ],
  }).compile()

  const appealSummonsRepositoryService =
    appealSummonsModule.get<AppealSummonsRepositoryService>(
      AppealSummonsRepositoryService,
    )

  const appealEventLogRepositoryService =
    appealSummonsModule.get<AppealEventLogRepositoryService>(
      AppealEventLogRepositoryService,
    )

  const pdfService = appealSummonsModule.get<PdfService>(PdfService)

  const awsS3Service = appealSummonsModule.get<AwsS3Service>(AwsS3Service)

  const sequelize = appealSummonsModule.get<Sequelize>(Sequelize)

  const appealSummonsController =
    appealSummonsModule.get<AppealSummonsController>(AppealSummonsController)

  const appealSummonsService =
    appealSummonsModule.get<AppealSummonsService>(AppealSummonsService)

  appealSummonsModule.close()

  return {
    appealSummonsRepositoryService,
    appealEventLogRepositoryService,
    pdfService,
    awsS3Service,
    sequelize,
    appealSummonsController,
    appealSummonsService,
  }
}

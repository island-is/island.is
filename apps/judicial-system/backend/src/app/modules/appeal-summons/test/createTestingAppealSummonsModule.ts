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
import { PoliceService } from '../../police'
import {
  AppealEventLogRepositoryService,
  AppealSummonsRepositoryService,
  CaseRepositoryService,
} from '../../repository'
import { AppealSummonsController } from '../appealSummons.controller'
import { AppealSummonsService } from '../appealSummons.service'

jest.mock('../../case/pdf.service')
jest.mock('../../case/case.service')
jest.mock('../../aws-s3/awsS3.service')
jest.mock('../../police/police.service')
jest.mock('../../repository/services/appealSummonsRepository.service')
jest.mock('../../repository/services/appealEventLogRepository.service')
jest.mock('../../repository/services/caseRepository.service')

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
      PoliceService,
      CaseRepositoryService,
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

  const policeService = appealSummonsModule.get<PoliceService>(PoliceService)

  const caseRepositoryService = appealSummonsModule.get<CaseRepositoryService>(
    CaseRepositoryService,
  )

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
    policeService,
    caseRepositoryService,
    sequelize,
    appealSummonsController,
    appealSummonsService,
  }
}

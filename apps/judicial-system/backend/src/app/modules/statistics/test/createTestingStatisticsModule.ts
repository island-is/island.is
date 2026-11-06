import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { AwsS3Service } from '../../aws-s3'
import {
  CaseRepositoryService,
  InstitutionRepositoryService,
  SubpoenaRepositoryService,
} from '../../repository'
import { StatisticsController } from '../statistics.controller'
import { StatisticsService } from '../statistics.service'

jest.mock('../../aws-s3/awsS3.service')
jest.mock('../../repository/services/caseRepository.service')
jest.mock('../../repository/services/institutionRepository.service')
jest.mock('../../repository/services/subpoenaRepository.service')

export const createTestingStatisticsModule = async () => {
  const statisticsModule = await Test.createTestingModule({
    controllers: [StatisticsController],
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        },
      },
      AwsS3Service,
      CaseRepositoryService,
      InstitutionRepositoryService,
      SubpoenaRepositoryService,
      StatisticsService,
    ],
  }).compile()

  const logger = statisticsModule.get(LOGGER_PROVIDER)

  const awsS3Service =
    statisticsModule.get<jest.Mocked<AwsS3Service>>(AwsS3Service)

  const caseRepositoryService = statisticsModule.get<
    jest.Mocked<CaseRepositoryService>
  >(CaseRepositoryService)

  const institutionRepositoryService = statisticsModule.get<
    jest.Mocked<InstitutionRepositoryService>
  >(InstitutionRepositoryService)

  const subpoenaRepositoryService = statisticsModule.get<
    jest.Mocked<SubpoenaRepositoryService>
  >(SubpoenaRepositoryService)

  const statisticsService =
    statisticsModule.get<StatisticsService>(StatisticsService)

  const statisticsController =
    statisticsModule.get<StatisticsController>(StatisticsController)

  statisticsModule.close()

  return {
    logger,
    awsS3Service,
    caseRepositoryService,
    institutionRepositoryService,
    subpoenaRepositoryService,
    statisticsService,
    statisticsController,
  }
}

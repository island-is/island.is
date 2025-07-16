import { Sequelize } from 'sequelize-typescript'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import {
  auditTrailModuleConfig,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  SharedAuthModule,
  sharedAuthModuleConfig,
} from '@island.is/judicial-system/auth'

import { CaseService } from '../../case'
import { FileService } from '../../file'
import { PoliceService } from '../../police'
import { Verdict } from '../models/verdict.model'
import { VerdictController } from '../verdict.controller'
import { VerdictService } from '../verdict.service'

jest.mock('../../case/case.service')
jest.mock('../../police/police.service')
jest.mock('../../file/file.service')

export const createTestingVerdictModule = async () => {
  const verdictModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig, auditTrailModuleConfig],
      }),
    ],
    controllers: [VerdictController],
    providers: [
      SharedAuthModule,
      CaseService,
      PoliceService,
      FileService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(Verdict),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      VerdictService,
      AuditTrailService,
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
    ],
  }).compile()

  const verdictModel = await verdictModule.resolve<typeof Verdict>(
    getModelToken(Verdict),
  )

  const verdictController =
    verdictModule.get<VerdictController>(VerdictController)

  verdictModule.close()

  return {
    verdictController,
    verdictModel,
  }
}

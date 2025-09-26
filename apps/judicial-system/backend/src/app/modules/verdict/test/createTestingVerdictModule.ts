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
import { MessageService } from '@island.is/judicial-system/message'

import { CaseService, PdfService } from '../../case'
import { DefendantService } from '../../defendant'
import { FileService } from '../../file'
import { LawyerRegistryService } from '../../lawyer-registry/lawyerRegistry.service'
import { PoliceService } from '../../police'
import { Verdict } from '../../repository'
import { InternalVerdictController } from '../internalVerdict.controller'
import { VerdictController } from '../verdict.controller'
import { VerdictService } from '../verdict.service'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../case/case.service')
jest.mock('../../police/police.service')
jest.mock('../../file/file.service')
jest.mock('../../case/pdf.service')
jest.mock('../../defendant/defendant.service')
jest.mock('../../lawyer-registry/lawyerRegistry.service')

export const createTestingVerdictModule = async () => {
  const verdictModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [sharedAuthModuleConfig, auditTrailModuleConfig],
      }),
    ],
    controllers: [VerdictController, InternalVerdictController],
    providers: [
      SharedAuthModule,
      MessageService,
      CaseService,
      PoliceService,
      FileService,
      PdfService,
      DefendantService,
      LawyerRegistryService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
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

  const verdictService = verdictModule.get<VerdictService>(VerdictService)

  const policeService = verdictModule.get<PoliceService>(PoliceService)

  const fileService = verdictModule.get<FileService>(FileService)

  const verdictController =
    verdictModule.get<VerdictController>(VerdictController)

  const internalVerdictController =
    verdictModule.get<InternalVerdictController>(InternalVerdictController)

  const sequelize = verdictModule.get<Sequelize>(Sequelize)

  verdictModule.close()

  return {
    verdictController,
    internalVerdictController,
    verdictService,
    policeService,
    fileService,
    verdictModel,
    sequelize,
  }
}

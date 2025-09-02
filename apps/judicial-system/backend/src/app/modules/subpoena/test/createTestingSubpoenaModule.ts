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

import { CaseService, InternalCaseService, PdfService } from '../../case'
import { CourtService } from '../../court'
import { DefendantService } from '../../defendant'
import { EventService } from '../../event'
import { FileService } from '../../file'
import { PoliceService } from '../../police'
import { Defendant, Subpoena } from '../../repository'
import { UserService } from '../../user'
import { InternalSubpoenaController } from '../internalSubpoena.controller'
import { LimitedAccessSubpoenaController } from '../limitedAccessSubpoena.controller'
import { SubpoenaController } from '../subpoena.controller'
import { SubpoenaService } from '../subpoena.service'

jest.mock('@island.is/judicial-system/message')
jest.mock('../../user/user.service')
jest.mock('../../case/case.service')
jest.mock('../../case/pdf.service')
jest.mock('../../police/police.service')
jest.mock('../../event/event.service')
jest.mock('../../defendant/defendant.service')
jest.mock('../../court/court.service')
jest.mock('../../file/file.service')
jest.mock('../../case/internalCase.service')

export const createTestingSubpoenaModule = async () => {
  const subpoenaModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [sharedAuthModuleConfig, auditTrailModuleConfig],
      }),
    ],
    controllers: [
      SubpoenaController,
      InternalSubpoenaController,
      LimitedAccessSubpoenaController,
    ],
    providers: [
      { provide: Sequelize, useValue: { transaction: jest.fn() } },
      SharedAuthModule,
      UserService,
      CaseService,
      PdfService,
      FileService,
      PoliceService,
      EventService,
      DefendantService,
      CourtService,
      InternalCaseService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(Subpoena),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      {
        provide: getModelToken(Defendant),
        useValue: {
          findOne: jest.fn(),
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      SubpoenaService,
      AuditTrailService,
      MessageService,
    ],
  }).compile()

  const userService = subpoenaModule.get<UserService>(UserService)

  const pdfService = subpoenaModule.get<PdfService>(PdfService)

  const fileService = subpoenaModule.get<FileService>(FileService)

  const policeService = subpoenaModule.get<PoliceService>(PoliceService)

  const courtService = subpoenaModule.get<CourtService>(CourtService)

  const internalCaseService =
    subpoenaModule.get<InternalCaseService>(InternalCaseService)

  const subpoenaModel = await subpoenaModule.resolve<typeof Subpoena>(
    getModelToken(Subpoena),
  )

  const subpoenaService = subpoenaModule.get<SubpoenaService>(SubpoenaService)

  const subpoenaController =
    subpoenaModule.get<SubpoenaController>(SubpoenaController)

  const internalSubpoenaController =
    subpoenaModule.get<InternalSubpoenaController>(InternalSubpoenaController)

  const limitedAccessSubpoenaController =
    subpoenaModule.get<LimitedAccessSubpoenaController>(
      LimitedAccessSubpoenaController,
    )

  subpoenaModule.close()

  return {
    userService,
    pdfService,
    fileService,
    policeService,
    courtService,
    internalCaseService,
    subpoenaModel,
    subpoenaService,
    subpoenaController,
    internalSubpoenaController,
    limitedAccessSubpoenaController,
  }
}

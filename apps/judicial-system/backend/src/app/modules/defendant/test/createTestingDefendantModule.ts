import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../../../../environments'
import { CaseService } from '../../case'
import { Defendant } from '../models/defendant.model'
import { DefendantService } from '../defendant.service'
import { DefendantController } from '../defendant.controller'

jest.mock('../../case/case.service.ts')

export const createTestingDefendantModule = async () => {
  const defendantModule = await Test.createTestingModule({
    imports: [
      SharedAuthModule.register({
        jwtSecret: environment.auth.jwtSecret,
        secretToken: environment.auth.secretToken,
      }),
    ],
    controllers: [DefendantController],
    providers: [
      CaseService,
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(Defendant),
        useValue: {
          findOne: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          findByPk: jest.fn(),
        },
      },
      DefendantService,
    ],
  }).compile()

  const defendantModel = await defendantModule.resolve<typeof Defendant>(
    getModelToken(Defendant),
  )

  const defendantService = defendantModule.get<DefendantService>(
    DefendantService,
  )

  const defendantController = defendantModule.get<DefendantController>(
    DefendantController,
  )

  return {
    defendantModel,
    defendantService,
    defendantController,
  }
}

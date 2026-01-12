import { mock } from 'jest-mock-extended'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { Institution } from '../../repository'
import { InstitutionController } from '../institution.controller'
import { InstitutionService } from '../institution.service'

export const createTestingInstitutionModule = async () => {
  const fileModule = await Test.createTestingModule({
    controllers: [InstitutionController],
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      {
        provide: getModelToken(Institution),
        useValue: {
          create: jest.fn().mockRejectedValue(new Error('Some found')),
          findAll: jest.fn().mockRejectedValue(new Error('Some found')),
          findOne: jest.fn().mockRejectedValue(new Error('Some found')),
          update: jest.fn().mockRejectedValue(new Error('Some found')),
        },
      },
      InstitutionService,
    ],
  })
    .useMocker((token) => {
      if (typeof token === 'function') {
        return mock()
      }
    })
    .compile()

  const institutionModel = await fileModule.resolve<typeof Institution>(
    getModelToken(Institution),
  )

  const institutionController = fileModule.get<InstitutionController>(
    InstitutionController,
  )

  fileModule.close()

  return {
    institutionModel,
    institutionController,
  }
}

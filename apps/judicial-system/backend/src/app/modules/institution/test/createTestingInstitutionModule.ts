import { mock } from 'jest-mock-extended'

import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { InstitutionRepositoryService } from '../../repository'
import { InstitutionController } from '../institution.controller'
import { InstitutionService } from '../institution.service'

export const createTestingInstitutionModule = async () => {
  const institutionModule = await Test.createTestingModule({
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
        provide: InstitutionRepositoryService,
        useValue: {
          findById: jest.fn().mockRejectedValue(new Error('Some error')),
          findAllActive: jest.fn().mockRejectedValue(new Error('Some error')),
          findAllActiveByTypes: jest
            .fn()
            .mockRejectedValue(new Error('Some error')),
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

  const institutionRepositoryService =
    institutionModule.get<InstitutionRepositoryService>(
      InstitutionRepositoryService,
    )

  const institutionController = institutionModule.get<InstitutionController>(
    InstitutionController,
  )

  institutionModule.close()

  return {
    institutionRepositoryService,
    institutionController,
  }
}

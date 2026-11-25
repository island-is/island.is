import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { Case } from '../models/case.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'
import { CaseRepositoryService } from '../services/caseRepository.service'

const mockModel = () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn(),
})

export const createTestingRepositoryModule = async () => {
  const repositoryModule = await Test.createTestingModule({
    providers: [
      {
        provide: LOGGER_PROVIDER,
        useValue: {
          debug: jest.fn(),
          info: jest.fn(),
          error: jest.fn(),
        },
      },
      { provide: getModelToken(Case), useValue: mockModel() },
      {
        provide: CaseDefendantPoliceCaseNumberRepositoryService,
        useValue: {
          replaceUnassignedFromPoliceCaseNumbersArray: jest
            .fn()
            .mockResolvedValue(undefined),
          resolvePoliceCaseNumbersForCases: jest
            .fn()
            .mockResolvedValue(undefined),
        },
      },
      CaseRepositoryService,
    ],
  }).compile()

  const caseModel = repositoryModule.get<typeof Case>(getModelToken(Case))

  const caseDefendantPoliceCaseNumberRepositoryService =
    repositoryModule.get<CaseDefendantPoliceCaseNumberRepositoryService>(
      CaseDefendantPoliceCaseNumberRepositoryService,
    )

  const caseRepositoryService = repositoryModule.get<CaseRepositoryService>(
    CaseRepositoryService,
  )

  repositoryModule.close()

  return {
    caseRepositoryService,
    caseModel,
    caseDefendantPoliceCaseNumberRepositoryService,
  }
}

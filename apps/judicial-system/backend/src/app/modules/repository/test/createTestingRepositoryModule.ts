import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { AppealCase } from '../models/appealCase.model'
import { Case } from '../models/case.model'
import { CaseFile } from '../models/caseFile.model'
import { CaseString } from '../models/caseString.model'
import { DateLog } from '../models/dateLog.model'
import { Defendant } from '../models/defendant.model'
import { DefendantEventLog } from '../models/defendantEventLog.model'
import { EventLog } from '../models/eventLog.model'
import { IndictmentCount } from '../models/indictmentCount.model'
import { Subpoena } from '../models/subpoena.model'
import { Verdict } from '../models/verdict.model'
import { Victim } from '../models/victim.model'
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
      { provide: getModelToken(Defendant), useValue: mockModel() },
      { provide: getModelToken(Subpoena), useValue: mockModel() },
      { provide: getModelToken(Verdict), useValue: mockModel() },
      { provide: getModelToken(DefendantEventLog), useValue: mockModel() },
      { provide: getModelToken(CaseString), useValue: mockModel() },
      { provide: getModelToken(DateLog), useValue: mockModel() },
      { provide: getModelToken(EventLog), useValue: mockModel() },
      { provide: getModelToken(Victim), useValue: mockModel() },
      { provide: getModelToken(IndictmentCount), useValue: mockModel() },
      { provide: getModelToken(CaseFile), useValue: mockModel() },
      { provide: getModelToken(AppealCase), useValue: mockModel() },
      CaseRepositoryService,
    ],
  }).compile()

  const appealCaseModel = repositoryModule.get<typeof AppealCase>(
    getModelToken(AppealCase),
  )

  const caseRepositoryService = repositoryModule.get<CaseRepositoryService>(
    CaseRepositoryService,
  )

  repositoryModule.close()

  return {
    caseRepositoryService,
    appealCaseModel,
  }
}

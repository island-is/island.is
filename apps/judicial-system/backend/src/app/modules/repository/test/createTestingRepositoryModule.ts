import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { AppealCase } from '../models/appealCase.model'
import { Case } from '../models/case.model'
import { CaseFile } from '../models/caseFile.model'
import { CaseString } from '../models/caseString.model'
import { CivilClaimant } from '../models/civilClaimant.model'
import { DateLog } from '../models/dateLog.model'
import { Defendant } from '../models/defendant.model'
import { DefendantEventLog } from '../models/defendantEventLog.model'
import { EventLog } from '../models/eventLog.model'
import { IndictmentCount } from '../models/indictmentCount.model'
import { Offense } from '../models/offense.model'
import { Subpoena } from '../models/subpoena.model'
import { Verdict } from '../models/verdict.model'
import { Victim } from '../models/victim.model'
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
      { provide: getModelToken(Defendant), useValue: mockModel() },
      { provide: getModelToken(Subpoena), useValue: mockModel() },
      { provide: getModelToken(Verdict), useValue: mockModel() },
      { provide: getModelToken(DefendantEventLog), useValue: mockModel() },
      { provide: getModelToken(CaseString), useValue: mockModel() },
      { provide: getModelToken(DateLog), useValue: mockModel() },
      { provide: getModelToken(EventLog), useValue: mockModel() },
      { provide: getModelToken(Victim), useValue: mockModel() },
      { provide: getModelToken(IndictmentCount), useValue: mockModel() },
      { provide: getModelToken(Offense), useValue: mockModel() },
      { provide: getModelToken(CivilClaimant), useValue: mockModel() },
      { provide: getModelToken(CaseFile), useValue: mockModel() },
      { provide: getModelToken(AppealCase), useValue: mockModel() },
      {
        provide: CaseDefendantPoliceCaseNumberRepositoryService,
        useValue: {
          replaceUnassignedFromPoliceCaseNumbersArray: jest
            .fn()
            .mockResolvedValue(undefined),
          moveAssignedRowsToCaseForDefendant: jest
            .fn()
            .mockResolvedValue(undefined),
          findDistinctPoliceCaseNumbersByCaseIds: jest
            .fn()
            .mockResolvedValue(new Map()),
          findAssignedLinksByCaseId: jest.fn().mockResolvedValue([]),
          assignDefendantPoliceCaseNumbers: jest
            .fn()
            .mockResolvedValue([]),
          resolvePoliceCaseNumbersForCases: jest
            .fn()
            .mockResolvedValue(undefined),
        },
      },
      CaseRepositoryService,
    ],
  }).compile()

  const appealCaseModel = repositoryModule.get<typeof AppealCase>(
    getModelToken(AppealCase),
  )

  const caseModel = repositoryModule.get<typeof Case>(getModelToken(Case))

  const defendantModel = repositoryModule.get<typeof Defendant>(
    getModelToken(Defendant),
  )

  const indictmentCountModel = repositoryModule.get<typeof IndictmentCount>(
    getModelToken(IndictmentCount),
  )

  const offenseModel = repositoryModule.get<typeof Offense>(
    getModelToken(Offense),
  )

  const victimModel = repositoryModule.get<typeof Victim>(getModelToken(Victim))

  const civilClaimantModel = repositoryModule.get<typeof CivilClaimant>(
    getModelToken(CivilClaimant),
  )

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
    appealCaseModel,
    caseModel,
    defendantModel,
    indictmentCountModel,
    offenseModel,
    victimModel,
    civilClaimantModel,
    caseDefendantPoliceCaseNumberRepositoryService,
  }
}

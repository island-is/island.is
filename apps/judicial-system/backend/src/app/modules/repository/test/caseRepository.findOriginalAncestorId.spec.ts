import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { CaseType } from '@island.is/judicial-system/types'

import { AwsS3Service } from '../../aws-s3/awsS3.service'
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

const mockSequelizeModel = () => ({
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

describe('CaseRepositoryService — findOriginalAncestorId', () => {
  let caseRepositoryService: CaseRepositoryService
  let caseModel: ReturnType<typeof mockSequelizeModel>

  // findParentCaseId reads only the parentCaseId column via findByPk, so we
  // drive the parent chain by stubbing findByPk per id.
  const stubParentChain = (chain: Record<string, string | null>) => {
    caseModel.findByPk.mockImplementation((id: string) =>
      Promise.resolve(
        id in chain ? ({ parentCaseId: chain[id] } as Case) : null,
      ),
    )
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    caseModel = mockSequelizeModel()

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(Case), useValue: caseModel },
        { provide: getModelToken(Defendant), useValue: mockSequelizeModel() },
        { provide: getModelToken(Subpoena), useValue: mockSequelizeModel() },
        { provide: getModelToken(Verdict), useValue: mockSequelizeModel() },
        {
          provide: getModelToken(DefendantEventLog),
          useValue: mockSequelizeModel(),
        },
        { provide: getModelToken(CaseString), useValue: mockSequelizeModel() },
        { provide: getModelToken(DateLog), useValue: mockSequelizeModel() },
        { provide: getModelToken(EventLog), useValue: mockSequelizeModel() },
        { provide: getModelToken(Victim), useValue: mockSequelizeModel() },
        {
          provide: getModelToken(IndictmentCount),
          useValue: mockSequelizeModel(),
        },
        { provide: getModelToken(Offense), useValue: mockSequelizeModel() },
        {
          provide: getModelToken(CivilClaimant),
          useValue: mockSequelizeModel(),
        },
        { provide: getModelToken(CaseFile), useValue: mockSequelizeModel() },
        { provide: getModelToken(AppealCase), useValue: mockSequelizeModel() },
        {
          provide: CaseDefendantPoliceCaseNumberRepositoryService,
          useValue: {},
        },
        { provide: AwsS3Service, useValue: {} },
        CaseRepositoryService,
      ],
    }).compile()

    caseRepositoryService = moduleRef.get(CaseRepositoryService)
  })

  describe('indictment route', () => {
    it('returns the split case id for a split indictment without walking parents', async () => {
      const theCase = {
        id: 'split-child-id',
        type: CaseType.INDICTMENT,
        splitCaseId: 'split-origin-id',
      } as Case

      const result = await caseRepositoryService.findOriginalAncestorId(theCase)

      expect(result).toBe('split-origin-id')
      expect(caseModel.findByPk).not.toHaveBeenCalled()
    })

    it('returns the case id for an indictment that was not split', async () => {
      const theCase = {
        id: 'indictment-id',
        type: CaseType.INDICTMENT,
      } as Case

      const result = await caseRepositoryService.findOriginalAncestorId(theCase)

      expect(result).toBe('indictment-id')
      expect(caseModel.findByPk).not.toHaveBeenCalled()
    })

    it('walks the parent chain for a duplicated indictment draft', async () => {
      // duplicate -> original (root)
      stubParentChain({ 'original-id': null })

      const theCase = {
        id: 'duplicate-id',
        type: CaseType.INDICTMENT,
        parentCaseId: 'original-id',
      } as Case

      const result = await caseRepositoryService.findOriginalAncestorId(theCase)

      expect(result).toBe('original-id')
      expect(caseModel.findByPk).toHaveBeenCalledTimes(1)
    })
  })

  describe('request route (parent walk)', () => {
    it('returns the case id when the request case has no parent', async () => {
      const theCase = {
        id: 'root-id',
        type: CaseType.CUSTODY,
      } as Case

      const result = await caseRepositoryService.findOriginalAncestorId(theCase)

      expect(result).toBe('root-id')
      expect(caseModel.findByPk).not.toHaveBeenCalled()
    })

    it('walks one level up to the original ancestor', async () => {
      stubParentChain({ 'parent-id': null })

      const theCase = {
        id: 'child-id',
        type: CaseType.CUSTODY,
        parentCaseId: 'parent-id',
      } as Case

      const result = await caseRepositoryService.findOriginalAncestorId(theCase)

      expect(result).toBe('parent-id')
      expect(caseModel.findByPk).toHaveBeenCalledTimes(1)
    })

    it('walks the full chain to the topmost ancestor for multi-level extensions', async () => {
      // grandchild -> child -> parent (root)
      stubParentChain({ 'parent-id': null, 'child-id': 'parent-id' })

      const theCase = {
        id: 'grandchild-id',
        type: CaseType.CUSTODY,
        parentCaseId: 'child-id',
      } as Case

      const result = await caseRepositoryService.findOriginalAncestorId(theCase)

      expect(result).toBe('parent-id')
      expect(caseModel.findByPk).toHaveBeenCalledTimes(2)
    })

    it('stops at the last resolvable ancestor when a parent row is missing', async () => {
      // child points at a parent id, but that row no longer exists
      stubParentChain({})

      const theCase = {
        id: 'child-id',
        type: CaseType.CUSTODY,
        parentCaseId: 'missing-parent-id',
      } as Case

      const result = await caseRepositoryService.findOriginalAncestorId(theCase)

      expect(result).toBe('missing-parent-id')
      expect(caseModel.findByPk).toHaveBeenCalledTimes(1)
    })
  })
})

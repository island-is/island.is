import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { Case } from '../models/case.model'
import { CourtSession } from '../models/courtSession.model'
import { CourtSessionString } from '../models/courtSessionString.model'
import { EventLog } from '../models/eventLog.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'
import { CourtDocumentRepositoryService } from '../services/courtDocumentRepository.service'
import { CourtSessionRepositoryService } from '../services/courtSessionRepository.service'

describe('CourtSessionRepositoryService', () => {
  const transaction = {} as Transaction

  let service: CourtSessionRepositoryService
  let caseModel: { findAll: jest.Mock; findByPk: jest.Mock }
  let courtSessionModel: { create: jest.Mock; findOne: jest.Mock }
  let resolvePoliceCaseNumbersForCases: jest.Mock

  beforeEach(async () => {
    resolvePoliceCaseNumbersForCases = jest.fn().mockResolvedValue(undefined)

    caseModel = {
      findAll: jest.fn().mockResolvedValue([]),
      findByPk: jest.fn(),
    }

    courtSessionModel = {
      create: jest.fn().mockResolvedValue({ id: 'session-1' }),
      findOne: jest.fn(),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(EventLog), useValue: { findOne: jest.fn() } },
        { provide: getModelToken(Case), useValue: caseModel },
        {
          provide: getModelToken(CourtSessionString),
          useValue: { create: jest.fn().mockResolvedValue({}) },
        },
        { provide: getModelToken(CourtSession), useValue: courtSessionModel },
        {
          provide: CourtDocumentRepositoryService,
          useValue: {
            fileAllAvailableCourtDocumentsInCourtSession: jest
              .fn()
              .mockResolvedValue(undefined),
            updateMergedCourtDocuments: jest.fn().mockResolvedValue(false),
          },
        },
        {
          provide: CaseDefendantPoliceCaseNumberRepositoryService,
          useValue: { resolvePoliceCaseNumbersForCases },
        },
        CourtSessionRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(CourtSessionRepositoryService)
  })

  describe('create', () => {
    it('calls resolvePoliceCaseNumbersForCases when merged cases exist', async () => {
      const merged = [{ id: 'm1' }, { id: 'm2' }] as Case[]
      caseModel.findAll.mockResolvedValue(merged)

      await service.create('parent-case', { transaction })

      expect(resolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(merged, {
        transaction,
      })
    })

    it('does not call resolvePoliceCaseNumbersForCases when there are no merged cases', async () => {
      caseModel.findAll.mockResolvedValue([])

      await service.create('parent-case', { transaction })

      expect(resolvePoliceCaseNumbersForCases).not.toHaveBeenCalled()
    })
  })

  describe('addMergedCaseToLatestCourtSession', () => {
    it('calls resolvePoliceCaseNumbersForCases for the loaded merged case', async () => {
      const mergedCase = { id: 'merged-id' } as Case
      caseModel.findByPk.mockResolvedValue(mergedCase)
      courtSessionModel.findOne.mockResolvedValue({
        id: 'cs-1',
        isConfirmed: false,
      })

      await service.addMergedCaseToLatestCourtSession(
        'parent-case',
        'merged-id',
        { transaction },
      )

      expect(resolvePoliceCaseNumbersForCases).toHaveBeenCalledWith(
        [mergedCase],
        { transaction },
      )
    })
  })
})

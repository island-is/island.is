import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { AppealDecisionPartyRole } from '@island.is/judicial-system/types'

import { AppealDecision } from '../models/appealDecision.model'
import { AppealDecisionRepositoryService } from '../services/appealDecisionRepository.service'

describe('AppealDecisionRepositoryService', () => {
  const transaction = {} as Transaction
  let service: AppealDecisionRepositoryService
  let model: { findAll: jest.Mock; findOne: jest.Mock; upsert: jest.Mock }

  beforeEach(async () => {
    model = {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue([{ id: 'some-decision-id' }, true]),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(AppealDecision), useValue: model },
        AppealDecisionRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(AppealDecisionRepositoryService)
  })

  describe('findAllForRuling', () => {
    it('reads every decision of the ruling in the given transaction', async () => {
      const decisions = [{ id: 'some-decision-id' }]
      model.findAll.mockResolvedValueOnce(decisions)

      const result = await service.findAllForRuling(
        'some-case-id',
        'some-ruling-file-id',
        { transaction },
      )

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId: 'some-case-id', rulingFileId: 'some-ruling-file-id' },
        transaction,
      })
      expect(result).toBe(decisions)
    })

    it('rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.findAllForRuling('some-case-id', 'some-ruling-file-id', {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('lockAllForRuling', () => {
    it('locks every decision of the ruling for update, in id order', async () => {
      await service.lockAllForRuling('some-case-id', 'some-ruling-file-id', {
        transaction,
      })

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId: 'some-case-id', rulingFileId: 'some-ruling-file-id' },
        order: [['id', 'ASC']],
        lock: Transaction.LOCK.UPDATE,
        transaction,
      })
    })

    it('rethrows when the lock fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.lockAllForRuling('some-case-id', 'some-ruling-file-id', {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('existsForRuling', () => {
    it('queries on case and ruling file and reports a hit', async () => {
      model.findOne.mockResolvedValueOnce({ id: 'some-decision-id' })

      const result = await service.existsForRuling(
        'some-case-id',
        'some-ruling-file-id',
        { transaction },
      )

      expect(model.findOne).toHaveBeenCalledWith({
        where: { caseId: 'some-case-id', rulingFileId: 'some-ruling-file-id' },
        transaction,
      })
      expect(result).toBe(true)
    })

    it('reports a miss when the ruling has no decisions', async () => {
      const result = await service.existsForRuling(
        'some-case-id',
        'some-ruling-file-id',
        { transaction },
      )

      expect(result).toBe(false)
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.existsForRuling('some-case-id', 'some-ruling-file-id', {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('findByParty', () => {
    it('reads the decision keyed on the full party', async () => {
      const decision = { id: 'some-decision-id' }
      model.findOne.mockResolvedValueOnce(decision)

      const result = await service.findByParty(
        {
          caseId: 'some-case-id',
          rulingFileId: 'some-ruling-file-id',
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId: 'some-defendant-id',
          civilClaimantId: null,
        },
        { transaction },
      )

      expect(model.findOne).toHaveBeenCalledWith({
        where: {
          caseId: 'some-case-id',
          rulingFileId: 'some-ruling-file-id',
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId: 'some-defendant-id',
          civilClaimantId: null,
        },
        transaction,
      })
      expect(result).toBe(decision)
    })

    it('matches absent ids as null, never as undefined', async () => {
      await service.findByParty(
        {
          caseId: 'some-case-id',
          rulingFileId: 'some-ruling-file-id',
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
        },
        { transaction },
      )

      expect(model.findOne).toHaveBeenCalledWith({
        where: {
          caseId: 'some-case-id',
          rulingFileId: 'some-ruling-file-id',
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          defendantId: null,
          civilClaimantId: null,
        },
        transaction,
      })
    })

    it('returns null when the party has recorded no decision', async () => {
      const result = await service.findByParty(
        {
          caseId: 'some-case-id',
          rulingFileId: 'some-ruling-file-id',
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
        },
        { transaction },
      )

      expect(result).toBeNull()
    })

    it('rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.findByParty(
          {
            caseId: 'some-case-id',
            partyRole: AppealDecisionPartyRole.PROSECUTOR,
          },
          { transaction },
        ),
      ).rejects.toThrow(error)
    })
  })

  describe('upsert', () => {
    it('writes the party key with absent ids as null', async () => {
      await service.upsert(
        {
          caseId: 'some-case-id',
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
        },
        { decision: null },
        { transaction },
      )

      expect(model.upsert).toHaveBeenCalledWith(
        {
          caseId: 'some-case-id',
          rulingFileId: null,
          partyRole: AppealDecisionPartyRole.PROSECUTOR,
          defendantId: null,
          civilClaimantId: null,
          decision: null,
        },
        expect.objectContaining({ transaction }),
      )
    })

    it('targets the snake_case unique-index columns in ON CONFLICT', async () => {
      await service.upsert(
        {
          caseId: 'some-case-id',
          rulingFileId: 'some-ruling-file-id',
          partyRole: AppealDecisionPartyRole.DEFENDANT,
          defendantId: 'some-defendant-id',
        },
        { decision: null, announcement: null },
        { transaction },
      )

      // conflictFields are emitted verbatim into ON CONFLICT (...), so they must
      // be the DB column names. camelCase would fail at runtime.
      expect(model.upsert).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          conflictFields: [
            'case_id',
            'ruling_file_id',
            'party_role',
            'defendant_id',
            'civil_claimant_id',
          ],
        }),
      )
    })
  })
})

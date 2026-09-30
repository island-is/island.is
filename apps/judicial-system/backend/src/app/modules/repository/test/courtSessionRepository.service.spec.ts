import { Transaction } from 'sequelize'

import { InternalServerErrorException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { CourtSession } from '../models/courtSession.model'
import { CourtSessionRepositoryService } from '../services/courtSessionRepository.service'

// The repository owns the court_session table and nothing else. Filing
// documents into a new session, recording merged cases and emptying a session
// before deleting it are CourtSessionService's sequences, not the repository's.
describe('CourtSessionRepositoryService', () => {
  const caseId = 'some-case-id'
  const courtSessionId = 'some-court-session-id'
  const transaction = {} as Transaction

  let service: CourtSessionRepositoryService
  let model: { create: jest.Mock; findOne: jest.Mock; destroy: jest.Mock }

  beforeEach(async () => {
    model = {
      create: jest.fn().mockResolvedValue({ id: courtSessionId, caseId }),
      findOne: jest.fn().mockResolvedValue(null),
      destroy: jest.fn().mockResolvedValue(1),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(CourtSession), useValue: model },
        CourtSessionRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(CourtSessionRepositoryService)
  })

  describe('findLatestByCase', () => {
    it('reads the newest session of the case in the given transaction', async () => {
      const courtSession = { id: courtSessionId } as CourtSession
      model.findOne.mockResolvedValueOnce(courtSession)

      const result = await service.findLatestByCase(caseId, { transaction })

      expect(model.findOne).toHaveBeenCalledWith({
        where: { caseId },
        order: [['created', 'DESC']],
        transaction,
      })
      expect(result).toBe(courtSession)
    })

    it('returns null when the case has no sessions', async () => {
      expect(await service.findLatestByCase(caseId)).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(service.findLatestByCase(caseId)).rejects.toThrow(error)
    })
  })

  describe('create', () => {
    it('creates the session row and nothing else', async () => {
      const result = await service.create(caseId, { transaction })

      expect(model.create).toHaveBeenCalledWith({ caseId }, { transaction })
      expect(result).toEqual({ id: courtSessionId, caseId })
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(service.create(caseId, { transaction })).rejects.toThrow(
        error,
      )
    })
  })

  describe('delete', () => {
    it('deletes the session row by id and case', async () => {
      await service.delete(caseId, courtSessionId, { transaction })

      expect(model.destroy).toHaveBeenCalledWith({
        where: { id: courtSessionId, caseId },
        transaction,
      })
    })

    it('throws when no row was deleted', async () => {
      model.destroy.mockResolvedValueOnce(0)

      await expect(
        service.delete(caseId, courtSessionId, { transaction }),
      ).rejects.toThrow(InternalServerErrorException)
    })

    it('rethrows when the deletion fails', async () => {
      const error = new Error('Some error')
      model.destroy.mockRejectedValueOnce(error)

      await expect(
        service.delete(caseId, courtSessionId, { transaction }),
      ).rejects.toThrow(error)
    })
  })
})

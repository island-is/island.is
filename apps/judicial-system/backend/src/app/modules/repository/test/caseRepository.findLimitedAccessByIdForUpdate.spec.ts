import { Op, Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { CaseState } from '@island.is/judicial-system/types'

import { createTestingRepositoryModule } from './createTestingRepositoryModule'

import { Case } from '../models/case.model'
import { CaseRepositoryService } from '../services/caseRepository.service'
import {
  getLimitedAccessCaseInclude,
  limitedAccessCaseAttributes,
} from '../types/caseRepository.types'

describe('CaseRepositoryService - findLimitedAccessByIdForUpdate', () => {
  const caseId = uuid()
  const defenceUserNationalId = '1234567890'
  const transaction = {} as Transaction
  const where = {
    id: caseId,
    state: { [Op.not]: CaseState.DELETED },
    isArchived: false,
  }

  let caseRepositoryService: CaseRepositoryService
  let mockCaseModel: { findOne: jest.Mock }

  beforeEach(async () => {
    const { caseRepositoryService: service, caseModel } =
      await createTestingRepositoryModule()

    caseRepositoryService = service
    mockCaseModel = caseModel as unknown as { findOne: jest.Mock }
  })

  describe('a live case exists', () => {
    const theCase = { id: caseId } as Case
    let result: Case | null

    beforeEach(async () => {
      mockCaseModel.findOne
        .mockResolvedValueOnce({ id: caseId })
        .mockResolvedValueOnce(theCase)

      result = await caseRepositoryService.findLimitedAccessByIdForUpdate(
        caseId,
        { defenceUserNationalId, transaction },
      )
    })

    it('should lock the case row on its own, as findLiveByIdForUpdate does', () => {
      // The limited access read cannot carry the lock either: its include is
      // a tree of outer joins, which Postgres will not lock through.
      expect(mockCaseModel.findOne).toHaveBeenNthCalledWith(1, {
        attributes: ['id'],
        where,
        lock: Transaction.LOCK.UPDATE,
        transaction,
      })
    })

    it('should read the limited access case, narrowed to the defence user, in the same transaction', () => {
      expect(mockCaseModel.findOne).toHaveBeenNthCalledWith(2, {
        attributes: limitedAccessCaseAttributes,
        include: getLimitedAccessCaseInclude(defenceUserNationalId),
        where,
        transaction,
      })
      expect(result).toBe(theCase)
    })
  })

  describe('no live case exists', () => {
    let result: Case | null

    beforeEach(async () => {
      mockCaseModel.findOne.mockResolvedValueOnce(null)

      result = await caseRepositoryService.findLimitedAccessByIdForUpdate(
        caseId,
        { transaction },
      )
    })

    it('should not read the case', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledTimes(1)
      expect(result).toBeNull()
    })
  })

  describe('the lock cannot be taken', () => {
    const error = new Error('Some error')
    let thrownError: Error

    beforeEach(async () => {
      mockCaseModel.findOne.mockRejectedValueOnce(error)

      try {
        await caseRepositoryService.findLimitedAccessByIdForUpdate(caseId, {
          transaction,
        })
      } catch (caught) {
        thrownError = caught as Error
      }
    })

    it('should rethrow', () => {
      expect(thrownError).toBe(error)
      expect(mockCaseModel.findOne).toHaveBeenCalledTimes(1)
    })
  })
})

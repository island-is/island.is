import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { NotFoundException } from '@nestjs/common'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import {
  IndictmentCount,
  IndictmentCountRepositoryService,
} from '../../repository'
import { ReorderIndictmentCountsDto } from '../dto/reorderIndictmentCounts.dto'

interface Then {
  result: IndictmentCount[]
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  body: ReorderIndictmentCountsDto,
) => Promise<Then>

describe('IndictmentCountController - Reorder', () => {
  let mockIndictmentCountRepositoryService: IndictmentCountRepositoryService
  let givenWhenThen: GivenWhenThen
  let transaction: Transaction

  beforeEach(async () => {
    const {
      indictmentCountRepositoryService,
      indictmentCountController,
      sequelize,
    } = await createTestingIndictmentCountModule()

    mockIndictmentCountRepositoryService = indictmentCountRepositoryService
    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (
      caseId: string,
      body: ReorderIndictmentCountsDto,
    ): Promise<Then> => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.reorder(caseId, body)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('when called with empty list of updates', () => {
    const caseId = uuid()
    const body: ReorderIndictmentCountsDto = { counts: [] }

    let then: Then
    beforeEach(async () => {
      then = await givenWhenThen(caseId, body)
    })

    it('should return empty list of indictment counts', () => {
      expect(then.result).toHaveLength(0)
    })
  })

  describe('when all count updates are successful', () => {
    const caseId = uuid()
    const countUpdates = [
      { id: uuid(), displayOrder: 0 },
      { id: uuid(), displayOrder: 1 },
      { id: uuid(), displayOrder: 2 },
    ]
    const body: ReorderIndictmentCountsDto = { counts: countUpdates }

    let then: Then
    beforeEach(async () => {
      const mockUpdateByIdAndCase =
        mockIndictmentCountRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdateByIdAndCase.mockResolvedValue({
        numberOfAffectedRows: 1,
        indictmentCounts: [{}] as IndictmentCount[],
      })
      then = await givenWhenThen(caseId, body)
    })

    it('should return all indictment counts', () => {
      expect(then.result).toHaveLength(3)
    })

    it('should update each count in the case', () => {
      expect(
        mockIndictmentCountRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledTimes(3)
      expect(
        mockIndictmentCountRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(
        countUpdates[0].id,
        caseId,
        { displayOrder: countUpdates[0].displayOrder },
        { transaction },
      )
    })
  })

  describe('when a count update does not affect a single row', () => {
    const caseId = uuid()
    const countUpdates = [{ id: uuid(), displayOrder: 0 }]
    const body: ReorderIndictmentCountsDto = { counts: countUpdates }

    let then: Then
    beforeEach(async () => {
      const mockUpdateByIdAndCase =
        mockIndictmentCountRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdateByIdAndCase.mockResolvedValue({
        numberOfAffectedRows: 0,
        indictmentCounts: [] as IndictmentCount[],
      })
      then = await givenWhenThen(caseId, body)
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `IndictmentCount ${countUpdates[0].id} not found for case ${caseId}`,
      )
    })
  })

  describe('when reorder fails', () => {
    const caseId = uuid()
    const body: ReorderIndictmentCountsDto = {
      counts: [{ id: uuid(), displayOrder: 0 }],
    }

    let then: Then
    beforeEach(async () => {
      const mockUpdateByIdAndCase =
        mockIndictmentCountRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdateByIdAndCase.mockRejectedValueOnce(new Error('Some error'))
      then = await givenWhenThen(caseId, body)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

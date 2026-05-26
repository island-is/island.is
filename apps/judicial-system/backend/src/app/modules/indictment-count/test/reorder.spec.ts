import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { NotFoundException } from '@nestjs/common'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import { IndictmentCount } from '../../repository'
import { ReorderIndictmentCountsDto } from '../dto/reorderIndictmentCounts.dto'

interface Then {
  result: IndictmentCount[]
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  body: ReorderIndictmentCountsDto,
) => Promise<Then>

describe('IndictmentCountsController - Reorder', () => {
  let mockIndictmentCountModel: typeof IndictmentCount
  let givenWhenThen: GivenWhenThen
  let transaction: Transaction

  beforeEach(async () => {
    const { indictmentCountModel, indictmentCountsController, sequelize } =
      await createTestingIndictmentCountModule()

    mockIndictmentCountModel = indictmentCountModel
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
        then.result = await indictmentCountsController.reorder(caseId, body)
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
      const mockUpdate = mockIndictmentCountModel.update as jest.Mock
      mockUpdate.mockResolvedValue([1, [{}] as IndictmentCount[]])
      then = await givenWhenThen(caseId, body)
    })

    it('should return all indictment counts', () => {
      expect(then.result).toHaveLength(3)
    })

    it('should update each count in the case', () => {
      expect(mockIndictmentCountModel.update).toHaveBeenCalledTimes(3)
      expect(mockIndictmentCountModel.update).toHaveBeenCalledWith(
        { displayOrder: countUpdates[0].displayOrder },
        {
          where: { id: countUpdates[0].id, caseId },
          returning: true,
          transaction,
        },
      )
    })
  })

  describe('when a count update does not affect a single row', () => {
    const caseId = uuid()
    const countUpdates = [{ id: uuid(), displayOrder: 0 }]
    const body: ReorderIndictmentCountsDto = { counts: countUpdates }

    let then: Then
    beforeEach(async () => {
      const mockUpdate = mockIndictmentCountModel.update as jest.Mock
      mockUpdate.mockResolvedValue([0, [] as IndictmentCount[]])
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
      const mockUpdate = mockIndictmentCountModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))
      then = await givenWhenThen(caseId, body)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

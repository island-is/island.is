import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { IndictmentSubtype } from '@island.is/judicial-system/types'

import { createTestingIndictmentCountModule } from './createTestingIndictmentCountModule'

import {
  IndictmentCount,
  IndictmentCountRepositoryService,
  OffenseRepositoryService,
} from '../../repository'
import { UpdateIndictmentCountDto } from '../dto/updateIndictmentCount.dto'

interface Then {
  result: IndictmentCount | null
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  indictmentCountId: string,
  indictmentCountToUpdate: UpdateIndictmentCountDto,
) => Promise<Then>

describe('IndictmentCountController - Update', () => {
  const caseId = uuid()
  const indictmentCountId = uuid()
  const policeCaseNumber = uuid()
  const indictmentCountToUpdate = { policeCaseNumber }

  let mockIndictmentCountRepositoryService: IndictmentCountRepositoryService
  let mockOffenseRepositoryService: OffenseRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      indictmentCountRepositoryService,
      offenseRepositoryService,
      indictmentCountController,
      sequelize,
    } = await createTestingIndictmentCountModule()

    mockIndictmentCountRepositoryService = indictmentCountRepositoryService
    mockOffenseRepositoryService = offenseRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (
      caseId: string,
      indictmentCountId: string,
      indictmentCountToUpdate: UpdateIndictmentCountDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await indictmentCountController.update(
          caseId,
          indictmentCountId,
          indictmentCountToUpdate,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('indictment count updated', () => {
    const updatedIndictmentCount = {
      id: indictmentCountId,
      caseId,
      policeCaseNumber,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpdateByIdAndCase =
        mockIndictmentCountRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdateByIdAndCase.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        indictmentCounts: [updatedIndictmentCount],
      })

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        indictmentCountToUpdate,
      )
    })

    it('should update the indictment count', () => {
      expect(
        mockIndictmentCountRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(
        indictmentCountId,
        caseId,
        indictmentCountToUpdate,
        { transaction },
      )
      expect(
        mockOffenseRepositoryService.deleteAllForIndictmentCount,
      ).not.toHaveBeenCalled()
      expect(then.result).toBe(updatedIndictmentCount)
    })
  })

  describe('indictment count updated to a traffic violation', () => {
    const trafficViolationUpdate: UpdateIndictmentCountDto = {
      policeCaseNumberSubtypes: [IndictmentSubtype.TRAFFIC_VIOLATION],
      indictmentCountSubtypes: [IndictmentSubtype.TRAFFIC_VIOLATION],
      vehicleRegistrationNumber: 'AB123',
    }
    const updatedIndictmentCount = { id: indictmentCountId, caseId }
    let then: Then

    beforeEach(async () => {
      const mockUpdateByIdAndCase =
        mockIndictmentCountRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdateByIdAndCase.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        indictmentCounts: [updatedIndictmentCount],
      })

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        trafficViolationUpdate,
      )
    })

    it('should update the indictment count and keep its offenses', () => {
      expect(
        mockIndictmentCountRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(
        indictmentCountId,
        caseId,
        trafficViolationUpdate,
        { transaction },
      )
      expect(
        mockOffenseRepositoryService.deleteAllForIndictmentCount,
      ).not.toHaveBeenCalled()
      expect(then.result).toBe(updatedIndictmentCount)
    })
  })

  describe('indictment count updated away from a traffic violation', () => {
    const nonTrafficViolationUpdate: UpdateIndictmentCountDto = {
      policeCaseNumberSubtypes: [
        IndictmentSubtype.TRAFFIC_VIOLATION,
        IndictmentSubtype.THEFT,
      ],
      indictmentCountSubtypes: [IndictmentSubtype.THEFT],
      vehicleRegistrationNumber: 'AB123',
    }
    const updatedIndictmentCount = { id: indictmentCountId, caseId }
    let then: Then

    beforeEach(async () => {
      const mockUpdateByIdAndCase =
        mockIndictmentCountRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdateByIdAndCase.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        indictmentCounts: [updatedIndictmentCount],
      })

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        nonTrafficViolationUpdate,
      )
    })

    it('should clear the traffic violation fields and delete the offenses', () => {
      expect(
        mockOffenseRepositoryService.deleteAllForIndictmentCount,
      ).toHaveBeenCalledWith(indictmentCountId, { transaction })
      expect(
        mockIndictmentCountRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(
        indictmentCountId,
        caseId,
        {
          ...nonTrafficViolationUpdate,
          vehicleRegistrationNumber: null,
          recordedSpeed: null,
          speedLimit: null,
          lawsBroken: [],
          legalArguments: '',
        },
        { transaction },
      )
      expect(then.result).toBe(updatedIndictmentCount)
    })
  })

  describe('indictment count update fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdateByIdAndCase =
        mockIndictmentCountRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdateByIdAndCase.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(
        caseId,
        indictmentCountId,
        indictmentCountToUpdate,
      )
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

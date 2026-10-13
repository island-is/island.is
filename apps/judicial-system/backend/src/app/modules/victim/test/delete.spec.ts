import { v4 as uuid } from 'uuid'

import { createTestingVictimModule } from './createTestingVictimModule'

import { Case, Victim, VictimRepositoryService } from '../../repository'
import { DeleteVictimResponse } from '../models/deleteVictim.response'

interface Then {
  result: DeleteVictimResponse
  error: Error
}

type GivenWhenThen = (courtCaseNumber?: string) => Promise<Then>

describe('VictimController - Delete', () => {
  const caseId = uuid()
  const victimId = uuid()

  let mockVictimRepositoryService: VictimRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { victimController, victimRepositoryService } =
      await createTestingVictimModule()

    mockVictimRepositoryService = victimRepositoryService

    const mockDelete =
      mockVictimRepositoryService.deleteByIdAndCase as jest.Mock
    mockDelete.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await victimController.delete(
          caseId,
          victimId,
          {
            id: caseId,
          } as Case,
          { id: victimId } as Victim,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('victim deleted', () => {
    let then: Then

    beforeEach(async () => {
      const mockDelete =
        mockVictimRepositoryService.deleteByIdAndCase as jest.Mock
      mockDelete.mockResolvedValue(1)

      then = await givenWhenThen()
    })

    it('should delete the victim', () => {
      expect(
        mockVictimRepositoryService.deleteByIdAndCase,
      ).toHaveBeenCalledWith(victimId, caseId)
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('victim deletion fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

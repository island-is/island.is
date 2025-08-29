import { uuid } from 'uuidv4'

import { createTestingVictimModule } from './createTestingVictimModule'

import { Case, Victim } from '../../repository'
import { DeleteVictimResponse } from '../models/deleteVictim.response'

interface Then {
  result: DeleteVictimResponse
  error: Error
}

type GivenWhenThen = (courtCaseNumber?: string) => Promise<Then>

describe('VictimController - Delete', () => {
  const caseId = uuid()
  const victimId = uuid()

  let mockVictimModel: typeof Victim
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { victimController, victimModel } = await createTestingVictimModule()

    mockVictimModel = victimModel

    const mockDestroy = mockVictimModel.destroy as jest.Mock
    mockDestroy.mockRejectedValue(new Error('Some error'))

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
      const mockDestroy = mockVictimModel.destroy as jest.Mock
      mockDestroy.mockResolvedValue(1)

      then = await givenWhenThen()
    })

    it('should delete the victim', () => {
      expect(mockVictimModel.destroy).toHaveBeenCalledWith({
        where: { id: victimId, caseId },
      })
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

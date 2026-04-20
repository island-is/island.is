import { v4 as uuid } from 'uuid'

import { createTestingVictimModule } from './createTestingVictimModule'

import { Case, Victim } from '../../repository'
import { UpdateVictimDto } from '../dto/updateVictim.dto'

interface Then {
  result: Victim
  error: Error
}

type GivenWhenThen = (victimUpdate: UpdateVictimDto) => Promise<Then>

describe('VictimController - Update', () => {
  const caseId = uuid()
  const theCase = { id: caseId } as Case
  const victimId = uuid()
  const victim = {
    id: victimId,
    name: 'Jane Doe',
  } as Victim

  let mockVictimModel: typeof Victim
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { victimController, victimModel } = await createTestingVictimModule()

    mockVictimModel = victimModel

    const mockUpdate = mockVictimModel.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (victimUpdate) => {
      const then = {} as Then

      await victimController
        .update(theCase.id, victim.id, victim, theCase, victimUpdate)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('victim updated', () => {
    const victimUpdate = { hasNationalId: true, nationalId: uuid() }
    const updatedVictim = { ...victim, ...victimUpdate }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockVictimModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedVictim]])
      then = await givenWhenThen(victimUpdate)
    })

    it('should update the victim ', () => {
      expect(mockVictimModel.update).toHaveBeenCalledWith(victimUpdate, {
        where: { id: victimId, caseId },
        returning: true,
      })
      expect(then.result).toBe(updatedVictim)
    })
  })

  describe('victim update fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({})
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

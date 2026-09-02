import { v4 as uuid } from 'uuid'

import { createTestingVictimModule } from './createTestingVictimModule'

import { Case, Victim, VictimRepositoryService } from '../../repository'
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

  let mockVictimRepositoryService: VictimRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { victimController, victimRepositoryService } =
      await createTestingVictimModule()

    mockVictimRepositoryService = victimRepositoryService

    const mockUpdate =
      mockVictimRepositoryService.updateByIdAndCase as jest.Mock
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
      const mockUpdate =
        mockVictimRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        victims: [updatedVictim],
      })
      then = await givenWhenThen(victimUpdate)
    })

    it('should update the victim ', () => {
      expect(
        mockVictimRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(victimId, caseId, victimUpdate)
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

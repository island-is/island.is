import { v4 as uuid } from 'uuid'

import { createTestingVictimModule } from './createTestingVictimModule'

import { Case, Victim } from '../../repository'

interface Then {
  result: Victim
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('VictimController - Create', () => {
  const caseId = uuid()
  const theCase = { id: caseId } as Case
  const victimToCreate = {
    name: 'Jane Doe',
  }
  const victimId = uuid()
  const createdVictim = { id: victimId, caseId }

  let mockVictimModel: typeof Victim
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { victimController, victimModel } = await createTestingVictimModule()

    mockVictimModel = victimModel

    const mockCreate = mockVictimModel.create as jest.Mock
    mockCreate.mockResolvedValue(createdVictim)

    givenWhenThen = async () => {
      const then = {} as Then

      await victimController
        .create(theCase.id, theCase as Case, victimToCreate)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('victim created', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should create a victim', () => {
      expect(mockVictimModel.create).toHaveBeenCalledWith({
        ...victimToCreate,
        caseId,
      })
    })

    it('should return victim', () => {
      expect(then.result).toBe(createdVictim)
    })
  })

  describe('victim creation fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockVictimModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

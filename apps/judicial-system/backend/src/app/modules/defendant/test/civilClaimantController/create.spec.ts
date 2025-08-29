import { uuid } from 'uuidv4'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { Case, CivilClaimant } from '../../../repository'

interface Then {
  result: CivilClaimant
  error: Error
}

type GivenWhenThen = (caseId?: string) => Promise<Then>

describe('CivilClaimantController - Create', () => {
  const caseId = uuid()
  const civilClaimantId = uuid()
  const theCase = { id: caseId } as Case
  const civilClaimantToCreate = {
    caseId,
  }
  const createdCivilClaimant = { id: civilClaimantId, caseId }

  let mockCivilClaimantModel: typeof CivilClaimant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { civilClaimantModel, civilClaimantController } =
      await createTestingDefendantModule()

    mockCivilClaimantModel = civilClaimantModel

    const mockCreate = mockCivilClaimantModel.create as jest.Mock
    mockCreate.mockResolvedValue(createdCivilClaimant)

    givenWhenThen = async () => {
      const then = {} as Then

      await civilClaimantController
        .create(theCase.id, theCase)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('civil claimant creation', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId)
    })
    it('should create a civil claimant', () => {
      expect(mockCivilClaimantModel.create).toHaveBeenCalledWith(
        civilClaimantToCreate,
      )
    })

    it('should return the created civil claimant', () => {
      expect(then.result).toEqual(createdCivilClaimant)
    })
  })

  describe('civil claimant creation fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockCivilClaimantModel.create as jest.Mock
      mockCreate.mockRejectedValue(new Error('Test error'))

      then = await givenWhenThen(caseId)
    })

    it('should throw an error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toEqual('Test error')
    })
  })
})

import { uuid } from 'uuidv4'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { Case } from '../../../case'
import { InternalUpdateDefendantDto } from '../../dto/internalUpdateDefendant.dto'
import { Defendant } from '../../models/defendant.model'

interface Then {
  result: Defendant
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalDefendantController - Update defendant', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const defendantNationalId = uuid()
  const update = { somefield: 'somevalue' } as InternalUpdateDefendantDto
  const updatedDefendant = {
    id: defendantId,
    nationalId: defendantNationalId,
    ...update,
  }
  let mockDefendantModel: typeof Defendant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const defendant = {
      id: defendantId,
      nationalId: defendantNationalId,
    } as Defendant
    const { defendantModel, internalDefendantController } =
      await createTestingDefendantModule()

    mockDefendantModel = defendantModel

    const mockUpdate = mockDefendantModel.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async () => {
      const then = {} as Then

      await internalDefendantController
        .updateDefendant(
          caseId,
          defendantNationalId,
          { id: caseId, defendants: [defendant] } as Case,
          defendant,
          update,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('update defendant', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockDefendantModel.update as jest.Mock
      mockUpdate.mockResolvedValue([1, [updatedDefendant]])

      then = await givenWhenThen()
    })
    it('should update the defendant', async () => {
      expect(mockDefendantModel.update).toHaveBeenCalledWith(
        { ...update },
        { where: { id: defendantId, caseId }, returning: true },
      )
      expect(then.result).toEqual(updatedDefendant)
    })
  })
})

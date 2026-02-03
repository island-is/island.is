import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import {
  Case,
  Defendant,
  DefendantRepositoryService,
} from '../../../repository'
import { InternalUpdateDefendantDto } from '../../dto/internalUpdateDefendant.dto'

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
  let mockDefendantRepositoryService: DefendantRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const defendant = {
      id: defendantId,
      nationalId: defendantNationalId,
    } as Defendant
    const {
      sequelize,
      defendantRepositoryService,
      internalDefendantController,
    } = await createTestingDefendantModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    mockDefendantRepositoryService = defendantRepositoryService
    const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
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
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValue(updatedDefendant)

      then = await givenWhenThen()
    })
    it('should update the defendant', async () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        { ...update },
        { transaction },
      )
      expect(then.result).toEqual(updatedDefendant)
    })
  })
})

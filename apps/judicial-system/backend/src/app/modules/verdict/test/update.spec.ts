import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { ServiceRequirement } from '@island.is/judicial-system/types'

import { Case, Defendant, Verdict } from '../../repository'
import { UpdateVerdictDto } from '../dto/updateVerdict.dto'
import { createTestingVerdictModule } from './creatingTestingVerdictModule'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = (verdictUpdate: UpdateVerdictDto) => Promise<Then>

describe('VerdictController - Update', () => {
  const caseId = uuid()
  const theCase = { id: caseId, rulingDate: new Date(2020, 1, 1) } as Case

  const defendantId = uuid()
  const defendant = {
    id: defendantId,
    name: 'Jane Doe',
  } as Defendant

  const verdictId = uuid()
  const verdict = {
    id: verdictId,
    caseId,
    defendantId,
  } as Verdict

  let mockVerdictModel: typeof Verdict
  let transaction: Transaction

  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { verdictController, sequelize, verdictModel } =
      await createTestingVerdictModule()

    mockVerdictModel = verdictModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockUpdate = mockVerdictModel.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (verdictUpdate) => {
      const then = {} as Then

      await verdictController
        .update(theCase.id, defendant.id, theCase, verdict, verdictUpdate)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('verdict updated', () => {
    const verdictUpdate = {
      serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
    }
    const updateVerdict = { ...verdict, ...verdictUpdate }
    let then: Then

    beforeEach(async () => {
      const mockFind = mockVerdictModel.findOne as jest.Mock
      mockFind.mockResolvedValueOnce([1, [verdict]])

      const mockUpdate = mockVerdictModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updateVerdict]])

      then = await givenWhenThen(verdictUpdate)
    })

    it('should update the verdict ', () => {
      expect(mockVerdictModel.update).toHaveBeenCalledWith(
        { ...verdictUpdate, serviceDate: new Date(2020, 1, 1) },
        {
          where: { id: verdictId },
          returning: true,
          transaction,
        },
      )
      expect(then.result).toBe(updateVerdict)
    })
  })

  describe('verdict update fails', () => {
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

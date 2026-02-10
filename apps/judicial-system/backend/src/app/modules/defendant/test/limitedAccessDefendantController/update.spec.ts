import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Message } from '@island.is/judicial-system/message'
import {
  CaseType,
  PunishmentType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import {
  Case,
  Defendant,
  DefendantRepositoryService,
} from '../../../repository'
import { UpdateDefendantDto } from '../../dto/updateDefendant.dto'

interface Then {
  result: Defendant
  error: Error
}

type GivenWhenThen = (
  defendantUpdate: UpdateDefendantDto,
  type: CaseType,
  courtCaseNumber?: string,
) => Promise<Then>

describe('LimitedAccessDefendantController - Update', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const defendantId = uuid()
  const defendant = {
    id: defendantId,
    caseId,
    nationalId: uuid(),
    defenderEmail: uuid(),
  } as Defendant

  let mockQueuedMessages: Message[]
  let transaction: Transaction
  let mockDefendantRepositoryService: DefendantRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessages,
      sequelize,
      defendantRepositoryService,
      limitedAccessDefendantController,
    } = await createTestingDefendantModule()

    mockQueuedMessages = queuedMessages
    mockDefendantRepositoryService = defendantRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      defendantUpdate: UpdateDefendantDto,
      type: CaseType,
    ) => {
      const then = {} as Then

      await limitedAccessDefendantController
        .update(
          caseId,
          defendantId,
          user,
          { id: caseId, type } as Case,
          defendant,
          defendantUpdate,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defendant limited updated', () => {
    const defendantUpdate = { punishmentType: PunishmentType.IMPRISONMENT }
    const updatedDefendant = { ...defendant, ...defendantUpdate }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedDefendant)

      then = await givenWhenThen(defendantUpdate, CaseType.INDICTMENT)
    })

    it('should update the defendant without queuing', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        defendantUpdate,
        { transaction },
      )
      expect(then.result).toBe(updatedDefendant)
      expect(mockQueuedMessages).toEqual([])
    })
  })
})

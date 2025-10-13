import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { MessageService } from '@island.is/judicial-system/message'
import {
  CaseType,
  PunishmentType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { Case, Defendant } from '../../../repository'
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

describe('LimitedAccessDefendantController - UpdateDefendant', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const defendantId = uuid()
  const defendant = {
    id: defendantId,
    caseId,
    nationalId: uuid(),
    defenderEmail: uuid(),
  } as Defendant

  let mockMessageService: MessageService
  let transaction: Transaction
  let mockDefendantModel: typeof Defendant
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      sequelize,
      defendantModel,
      limitedAccessDefendantController,
    } = await createTestingDefendantModule()

    mockMessageService = messageService
    mockDefendantModel = defendantModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockUpdate = mockDefendantModel.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      defendantUpdate: UpdateDefendantDto,
      type: CaseType,
    ) => {
      const then = {} as Then

      await limitedAccessDefendantController
        .updateDefendant(
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
      const mockUpdate = mockDefendantModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [updatedDefendant]])

      then = await givenWhenThen(defendantUpdate, CaseType.INDICTMENT)
    })

    it('should update the defendant without queuing', () => {
      expect(mockDefendantModel.update).toHaveBeenCalledWith(defendantUpdate, {
        where: { id: defendantId, caseId },
        returning: true,
        transaction,
      })
      expect(then.result).toBe(updatedDefendant)
      expect(mockMessageService.sendMessagesToQueue).not.toHaveBeenCalled()
    })
  })
})

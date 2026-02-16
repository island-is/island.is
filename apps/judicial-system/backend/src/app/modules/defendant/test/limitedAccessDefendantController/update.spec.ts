import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Message } from '@island.is/judicial-system/message'
import {
  CaseType,
  DefendantEventType,
  InstitutionType,
  PunishmentType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import {
  Case,
  Defendant,
  DefendantEventLogRepositoryService,
  DefendantRepositoryService,
} from '../../../repository'
import { UpdateDefendantDto } from '../../dto/updateDefendant.dto'

interface Then {
  result: Defendant
  error: Error
}

type GivenWhenThen = (
  defendantUpdate: UpdateDefendantDto,
  theCase: Case,
  defendantOverride?: Defendant,
) => Promise<Then>

describe('LimitedAccessDefendantController - Update', () => {
  const prisonAdminUser = {
    id: uuid(),
    role: UserRole.PRISON_SYSTEM_STAFF,
    institution: { type: InstitutionType.PRISON_ADMIN },
  } as User
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
  let mockDefendantEventLogRepositoryService: DefendantEventLogRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessages,
      sequelize,
      defendantRepositoryService,
      defendantEventLogRepositoryService,
      limitedAccessDefendantController,
    } = await createTestingDefendantModule()

    mockQueuedMessages = queuedMessages
    mockDefendantRepositoryService = defendantRepositoryService
    mockDefendantEventLogRepositoryService = defendantEventLogRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Some error'))

    givenWhenThen = async (
      defendantUpdate: UpdateDefendantDto,
      theCase: Case,
      defendantOverride?: Defendant,
    ) => {
      const then = {} as Then
      const defendantToUse = defendantOverride ?? defendant

      await limitedAccessDefendantController
        .update(
          caseId,
          defendantId,
          prisonAdminUser,
          theCase,
          defendantToUse,
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

      then = await givenWhenThen(defendantUpdate, {
        id: caseId,
        type: CaseType.INDICTMENT,
      } as Case)
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

  describe('marks only the updated defendant as opened when punishmentType is set', () => {
    const defendantUpdate = { punishmentType: PunishmentType.IMPRISONMENT }
    const updatedDefendant = { ...defendant, ...defendantUpdate }

    const earlier = new Date(Date.now() - 10000)
    const currentDefendantWithLogs = {
      ...defendant,
      isSentToPrisonAdmin: true,
      eventLogs: [
        { eventType: DefendantEventType.SENT_TO_PRISON_ADMIN, created: earlier },
      ],
    } as Defendant

    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [currentDefendantWithLogs],
    } as Case

    beforeEach(() => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValue(updatedDefendant)

      const mockCreate =
        mockDefendantEventLogRepositoryService.create as jest.Mock
      mockCreate.mockResolvedValue({})
    })

    it('should mark only the current defendant as opened when punishmentType is set', async () => {
      await givenWhenThen(defendantUpdate, theCase, currentDefendantWithLogs)

      const mockCreate =
        mockDefendantEventLogRepositoryService.create as jest.Mock

      expect(mockCreate).toHaveBeenCalledTimes(1)
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          caseId,
          defendantId,
          eventType: DefendantEventType.OPENED_BY_PRISON_ADMIN,
        }),
        { transaction },
      )
    })

    it('should not create OPENED_BY_PRISON_ADMIN when punishmentType is not set', async () => {
      const mockCreate =
        mockDefendantEventLogRepositoryService.create as jest.Mock
      mockCreate.mockClear()

      await givenWhenThen({}, theCase, currentDefendantWithLogs)

      const openedByPrisonAdminCalls = mockCreate.mock.calls.filter(
        (call) =>
          call[0]?.eventType === DefendantEventType.OPENED_BY_PRISON_ADMIN,
      )
      expect(openedByPrisonAdminCalls).toHaveLength(0)
    })
  })
})

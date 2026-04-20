import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  CaseNotificationType,
  CaseType,
  DefendantNotificationType,
  DefenderChoice,
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

describe('DefendantController - Update', () => {
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
  let mockDefendantRepositoryService: DefendantRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessages,
      sequelize,
      defendantRepositoryService,
      defendantController,
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
      courtCaseNumber?: string,
    ) => {
      const then = {} as Then

      await defendantController
        .update(
          caseId,
          defendantId,
          user,
          { id: caseId, courtCaseNumber, type } as Case,
          defendant,
          defendantUpdate,
        )
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('defendant updated', () => {
    const defendantUpdate = { noNationalId: true }
    const updatedDefendant = { ...defendant, ...defendantUpdate }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedDefendant)

      then = await givenWhenThen(defendantUpdate, CaseType.CUSTODY)
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

  describe('defendant updated after case is delivered to court', () => {
    const defendantUpdate = { name: 'John Doe' }
    const updatedDefendant = { ...defendant, ...defendantUpdate }

    beforeEach(async () => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedDefendant)

      await givenWhenThen(defendantUpdate, CaseType.INDICTMENT, uuid())
    })

    it('should not queue', () => {
      expect(mockQueuedMessages).toEqual([])
    })
  })

  describe('defendant nationalId removed after case is delivered to court', () => {
    const defendantUpdate = { noNationalId: true }
    const updatedDefendant = { ...defendant, ...defendantUpdate }

    beforeEach(async () => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedDefendant)

      await givenWhenThen(defendantUpdate, CaseType.CUSTODY, uuid())
    })

    it('should queue messages', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
          user,
          caseId,
          elementId: defendantId,
        },
      ])
    })
  })

  describe('defendant nationalId changed after case is delivered to court', () => {
    const defendantUpdate = { nationalId: uuid() }
    const updatedDefendant = { ...defendant, ...defendantUpdate }

    beforeEach(async () => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedDefendant)

      await givenWhenThen(defendantUpdate, CaseType.TELECOMMUNICATIONS, uuid())
    })

    it('should queue messages', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT },
        },
        {
          type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
          user,
          caseId,
          elementId: defendantId,
        },
      ])
    })
  })

  describe.each([
    { isDefenderChoiceConfirmed: true, shouldSendEmail: true },
    { isDefenderChoiceConfirmed: false, shouldSendEmail: false },
  ])(
    "defendant's defender choice is changed",
    ({ isDefenderChoiceConfirmed, shouldSendEmail }) => {
      const defendantUpdate = { isDefenderChoiceConfirmed }
      const updatedDefendant = {
        defenderChoice: DefenderChoice.CHOOSE,
        ...defendant,
        ...defendantUpdate,
      }

      beforeEach(async () => {
        const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
        mockUpdate.mockResolvedValueOnce(updatedDefendant)

        await givenWhenThen(defendantUpdate, CaseType.INDICTMENT, uuid())
      })

      if (shouldSendEmail) {
        it('should queue messages if defender has been confirmed', () => {
          expect(mockQueuedMessages).toEqual([
            {
              type: MessageType.DELIVERY_TO_COURT_INDICTMENT_DEFENDER,
              user,
              caseId,
              elementId: defendantId,
            },
            {
              type: MessageType.DEFENDANT_NOTIFICATION,
              caseId,
              body: { type: DefendantNotificationType.DEFENDER_ASSIGNED },
              elementId: defendantId,
            },
            {
              type: MessageType.DEFENDANT_NOTIFICATION,
              caseId,
              user,
              body: {
                type: DefendantNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP,
              },
              elementId: defendantId,
            },
          ])
        })
      } else {
        it('should not queue message if defender has not been confirmed', () => {
          expect(mockQueuedMessages).toEqual([])
        })
      }
    },
  )

  describe('defendant in indictment is sent to prison admin', () => {
    const defendantUpdate = { isSentToPrisonAdmin: true }
    const updatedDefendant = { ...defendant, ...defendantUpdate }

    beforeEach(async () => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedDefendant)

      await givenWhenThen(defendantUpdate, CaseType.INDICTMENT, caseId)
    })

    it('should queue messages', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DEFENDANT_NOTIFICATION,
          caseId,
          elementId: defendantId,
          body: {
            type: DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
          },
        },
      ])
    })
  })

  describe('defendant in indictment is withdrawn from prison admin', () => {
    const defendantUpdate = { isSentToPrisonAdmin: false }
    const updatedDefendant = { ...defendant, ...defendantUpdate }

    beforeEach(async () => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedDefendant)

      await givenWhenThen(defendantUpdate, CaseType.INDICTMENT, caseId)
    })

    it('should queue messages for indictment withdrawn from prison admin', () => {
      expect(mockQueuedMessages).toEqual([
        {
          type: MessageType.DEFENDANT_NOTIFICATION,
          caseId,
          elementId: defendantId,
          body: {
            type: DefendantNotificationType.INDICTMENT_WITHDRAWN_FROM_PRISON_ADMIN,
          },
        },
      ])
    })
  })

  describe('defendant update fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({}, CaseType.CUSTODY)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})

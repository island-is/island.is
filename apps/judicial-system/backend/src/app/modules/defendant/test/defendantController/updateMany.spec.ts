import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, NotFoundException } from '@nestjs/common'

import { Message } from '@island.is/judicial-system/message'
import {
  AppealCaseState,
  AppealCaseTransition,
  AppealEventType,
  CaseIndictmentRulingDecision,
  CaseType,
  IndictmentCaseReviewDecision,
  SubpoenaType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingDefendantModule } from '../createTestingDefendantModule'

import { runInRequestContext } from '../../../../test'
import { AppealCaseService } from '../../../appeal-case/appealCase.service'
import {
  AppealCase,
  Case,
  Defendant,
  DefendantRepositoryService,
} from '../../../repository'
import { UpdateDefendantsDto } from '../../dto/updateDefendants.dto'

interface Then {
  result: Defendant[]
  error: Error
}

type GivenWhenThen = (
  body: UpdateDefendantsDto,
  caseOverrides?: Partial<Case>,
) => Promise<Then>

describe('DefendantController - Update many', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const courtCaseNumber = uuid()
  const defendantOne = {
    id: uuid(),
    caseId,
    subpoenaType: SubpoenaType.ABSENCE,
  } as Defendant
  const defendantTwo = {
    id: uuid(),
    caseId,
    subpoenaType: SubpoenaType.ARREST,
  } as Defendant
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    courtCaseNumber,
    defendants: [defendantOne, defendantTwo],
  } as Case

  let mockQueuedMessages: Message[]
  let mockDefendantRepositoryService: DefendantRepositoryService
  let mockAppealCaseService: AppealCaseService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessagesAfterCommit,
      sequelize,
      defendantRepositoryService,
      appealCaseService,
      defendantController,
    } = await createTestingDefendantModule()

    mockQueuedMessages = queuedMessagesAfterCommit
    mockDefendantRepositoryService = defendantRepositoryService
    mockAppealCaseService = appealCaseService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
    mockUpdate.mockImplementation(
      async (_caseId: string, defendantId: string, update: object) => ({
        ...theCase.defendants?.find((d) => d.id === defendantId),
        ...update,
      }),
    )

    givenWhenThen = async (
      body: UpdateDefendantsDto,
      caseOverrides: Partial<Case> = {},
    ) => {
      const then = {} as Then

      // Guards do not execute in controller unit tests, so the request
      // context the handler takes its transaction from is set up here.
      try {
        await runInRequestContext(async () => {
          then.result = await defendantController.updateMany(
            caseId,
            user,
            { ...theCase, ...caseOverrides } as Case,
            body,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendants updated', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        defendants: [
          { defendantId: defendantOne.id, subpoenaType: SubpoenaType.ABSENCE },
          {
            defendantId: defendantTwo.id,
            isAlternativeService: true,
            alternativeServiceDescription: 'Birt í Lögbirtingablaði',
          },
        ],
      })
    })

    it('should update every defendant in the request transaction, in order', () => {
      expect(mockDefendantRepositoryService.update).toHaveBeenCalledTimes(2)
      expect(mockDefendantRepositoryService.update).toHaveBeenNthCalledWith(
        1,
        caseId,
        defendantOne.id,
        { subpoenaType: SubpoenaType.ABSENCE },
        { transaction },
      )
      expect(mockDefendantRepositoryService.update).toHaveBeenNthCalledWith(
        2,
        caseId,
        defendantTwo.id,
        {
          isAlternativeService: true,
          alternativeServiceDescription: 'Birt í Lögbirtingablaði',
        },
        { transaction },
      )
    })

    it('should return the updated defendants', () => {
      expect(then.error).toBeUndefined()
      expect(then.result).toEqual([
        { ...defendantOne, subpoenaType: SubpoenaType.ABSENCE },
        {
          ...defendantTwo,
          isAlternativeService: true,
          alternativeServiceDescription: 'Birt í Lögbirtingablaði',
        },
      ])
    })

    // Resending the value a defendant already has is what the court's
    // overview screen does for every defendant, and it must stay a no-op.
    it('should not queue messages', () => {
      expect(mockQueuedMessages).toEqual([])
    })
  })

  describe('a defendant is not on the case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        defendants: [
          { defendantId: defendantOne.id, isDrivingLicenseSuspended: true },
          { defendantId: uuid(), isDrivingLicenseSuspended: true },
        ],
      })
    })

    it('should reject the batch before updating anyone', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(mockDefendantRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('a defendant is named twice', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        defendants: [
          { defendantId: defendantOne.id, isDrivingLicenseSuspended: true },
          { defendantId: defendantOne.id, isDrivingLicenseSuspended: false },
        ],
      })
    })

    it('should reject the batch before updating anyone', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockDefendantRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('an update fails part way through', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockDefendantRepositoryService.update as jest.Mock
      mockUpdate
        .mockResolvedValueOnce(defendantOne)
        .mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen({
        defendants: [
          { defendantId: defendantOne.id, isDrivingLicenseSuspended: true },
          { defendantId: defendantTwo.id, isDrivingLicenseSuspended: true },
        ],
      })
    })

    // The request's transaction is rolled back when the handler throws, so
    // the defendant written first does not stay written.
    it('should throw', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  // The public prosecution confirms its review decisions for every defendant
  // at once. Each changed decision files or withdraws the prosecution's
  // verdict appeal for that defendant in the batch's one transaction.
  describe('review decisions', () => {
    const rulingCase: Partial<Case> = {
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      defendants: [
        defendantOne,
        {
          ...defendantTwo,
          indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
        } as Defendant,
      ],
      verdictAppealCase: {
        id: uuid(),
        appealState: AppealCaseState.APPEALED,
        appealEventLogs: [
          {
            eventType: AppealEventType.APPEALED,
            defendantId: defendantTwo.id,
            userRole: UserRole.PROSECUTOR,
            created: new Date(),
          },
        ],
      } as AppealCase,
    }
    const decisions = {
      defendants: [
        {
          defendantId: defendantOne.id,
          indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
        },
        {
          defendantId: defendantTwo.id,
          indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
        },
      ],
    }

    it('should file and withdraw each defendant’s appeal in the request transaction', async () => {
      const then = await givenWhenThen(
        { ...decisions, registerVerdictAppeal: true },
        rulingCase,
      )

      expect(then.error).toBeUndefined()
      expect(mockAppealCaseService.create).toHaveBeenCalledTimes(1)
      expect(mockAppealCaseService.create).toHaveBeenCalledWith(
        expect.objectContaining({ id: caseId }),
        user,
        undefined,
        transaction,
        { defendantId: defendantOne.id },
      )
      expect(mockAppealCaseService.transition).toHaveBeenCalledTimes(1)
      expect(mockAppealCaseService.transition).toHaveBeenCalledWith(
        expect.objectContaining({ id: caseId }),
        rulingCase.verdictAppealCase,
        AppealCaseTransition.WITHDRAW_APPEAL,
        user,
        transaction,
        defendantTwo.id,
      )
    })

    // The intent is the batch's, not a defendant field.
    it('should not write the intent to any defendant', async () => {
      await givenWhenThen(
        { ...decisions, registerVerdictAppeal: true },
        rulingCase,
      )

      expect(mockDefendantRepositoryService.update).toHaveBeenNthCalledWith(
        1,
        caseId,
        defendantOne.id,
        { indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL },
        { transaction },
      )
      expect(mockDefendantRepositoryService.update).toHaveBeenNthCalledWith(
        2,
        caseId,
        defendantTwo.id,
        { indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT },
        { transaction },
      )
    })

    it('should file nothing when the intent is absent', async () => {
      const then = await givenWhenThen(decisions, rulingCase)

      expect(then.error).toBeUndefined()
      expect(mockAppealCaseService.create).not.toHaveBeenCalled()
      expect(mockAppealCaseService.transition).not.toHaveBeenCalled()
    })

    // One defendant's decision can no longer change, so none of them do.
    it('should fail the batch once the court of appeals has received the appeal', async () => {
      const then = await givenWhenThen(
        { ...decisions, registerVerdictAppeal: true },
        {
          ...rulingCase,
          verdictAppealCase: {
            ...rulingCase.verdictAppealCase,
            appealState: AppealCaseState.RECEIVED,
          } as AppealCase,
        },
      )

      expect(then.error).toBeInstanceOf(BadRequestException)
    })

    it('should fail the batch when filing an appeal fails', async () => {
      const mockCreate = mockAppealCaseService.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      const then = await givenWhenThen(
        { ...decisions, registerVerdictAppeal: true },
        rulingCase,
      )

      expect(then.error).toBeInstanceOf(Error)
      expect(mockAppealCaseService.transition).not.toHaveBeenCalled()
    })
  })
})

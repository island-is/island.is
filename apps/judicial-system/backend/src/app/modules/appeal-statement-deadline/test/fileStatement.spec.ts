import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { type Message } from '@island.is/judicial-system/message'
import {
  AppealCaseType,
  AppealEventType,
  CaseFileCategory,
  CaseFileState,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealStatementDeadlineModule } from './createTestingAppealStatementDeadlineModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import {
  AppealCase,
  AppealEventLog,
  Case,
  CaseFile,
  CivilClaimant,
  Defendant,
} from '../../repository'
import { FileAppealStatementDto } from '../dto/fileAppealStatement.dto'

describe('AppealStatementController - File statement', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const civilClaimantId = uuid()
  const defendantStatement = {
    category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
    defendantId,
  } as CaseFile
  const civilClaimantStatement = {
    category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
    civilClaimantId,
  } as CaseFile
  const prosecutionStatement = {
    category: CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT,
  } as CaseFile
  const user = {
    id: uuid(),
    nationalId: '0000000000',
    name: 'Some Person',
    title: 'aðstoðarmaður dómara',
    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
    institution: { name: 'Landsréttur' },
  } as User
  const transaction = {} as Transaction
  const createdEvent = { id: uuid() } as AppealEventLog

  let queuedMessages: Message[]
  let mockTransaction: jest.Mock
  let mockCreateEvent: jest.Mock
  let fileStatement: (
    dto: FileAppealStatementDto,
    caseFiles?: CaseFile[],
    appealCase?: Partial<AppealCase>,
  ) => Promise<AppealEventLog>

  beforeEach(async () => {
    const {
      queuedMessagesAfterCommit,
      sequelize,
      appealStatementController,
      appealEventLogRepositoryService,
    } = await createTestingAppealStatementDeadlineModule()

    queuedMessages = queuedMessagesAfterCommit
    mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)
    mockCreateEvent = appealEventLogRepositoryService.create as jest.Mock
    mockCreateEvent.mockResolvedValue(createdEvent)

    // The route is guarded by CaseExistsForUpdateGuard, which opens the
    // request transaction before the handler runs. Guards do not execute in
    // controller unit tests, so the request context is set up here instead.
    fileStatement = (
      dto,
      caseFiles = [
        defendantStatement,
        civilClaimantStatement,
        prosecutionStatement,
      ],
      appealCase = {},
    ) =>
      runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        return appealStatementController.fileStatement(
          caseId,
          appealCaseId,
          user,
          {
            id: caseId,
            defendants: [{ id: defendantId }] as Defendant[],
            civilClaimants: [{ id: civilClaimantId }] as CivilClaimant[],
            caseFiles,
          } as Case,
          {
            id: appealCaseId,
            appealType: AppealCaseType.VERDICT,
            ...appealCase,
          } as AppealCase,
          dto,
        )
      })
  })

  describe('filing', () => {
    // The same event the party would have written, naming the party the same
    // way, with the court user as the actor.
    it("records a defendant's statement as filed, by the court", async () => {
      const result = await fileStatement({ defendantId })

      expect(mockCreateEvent).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          defendantId,
          civilClaimantId: undefined,
          userRole: user.role,
          userId: user.id,
          nationalId: user.nationalId,
          userName: user.name,
          userTitle: user.title,
          institutionName: 'Landsréttur',
        },
        { transaction },
      )
      expect(result).toBe(createdEvent)
    })

    it("records a civil claimant's statement as filed", async () => {
      await fileStatement({ civilClaimantId })

      expect(mockCreateEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          civilClaimantId,
          defendantId: undefined,
        }),
        { transaction },
      )
    })

    // The prosecution is the party nobody is named for.
    it("records the prosecution's statement as filed when no party is named", async () => {
      await fileStatement({})

      expect(mockCreateEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          defendantId: undefined,
          civilClaimantId: undefined,
        }),
        { transaction },
      )
    })

    // The court knows; nobody has asked that the parties be told.
    it('queues no mails', async () => {
      await fileStatement({ defendantId })

      expect(queuedMessages).toEqual([])
    })

    // One call to sequelize.transaction: the guard's. A handler that opened a
    // transaction of its own, the deadlock the controller warns about, would
    // make it two.
    it('joins the transaction the guard opened rather than open one', async () => {
      await fileStatement({ defendantId })

      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })
  })

  describe('refusals', () => {
    it('refuses a party whose statement is already in', async () => {
      await expect(
        fileStatement({ defendantId }, undefined, {
          appealEventLogs: [
            {
              eventType: AppealEventType.APPEAL_STATEMENT_SENT,
              defendantId,
            } as AppealEventLog,
          ],
        }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreateEvent).not.toHaveBeenCalled()
    })

    // Another party's statement is not this party's.
    it('still files when only another party has filed', async () => {
      await fileStatement({ defendantId }, undefined, {
        appealEventLogs: [
          {
            eventType: AppealEventType.APPEAL_STATEMENT_SENT,
            civilClaimantId,
          } as AppealEventLog,
        ],
      })

      expect(mockCreateEvent).toHaveBeenCalled()
    })

    // The event says a statement is in; one has to be.
    it('refuses a party with no statement on the case', async () => {
      await expect(
        fileStatement({ defendantId }, [
          civilClaimantStatement,
          prosecutionStatement,
        ]),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreateEvent).not.toHaveBeenCalled()
    })

    it('does not count a deleted statement', async () => {
      await expect(
        fileStatement({ defendantId }, [
          { ...defendantStatement, state: CaseFileState.DELETED } as CaseFile,
        ]),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreateEvent).not.toHaveBeenCalled()
    })

    // A kæra statement is a different proceeding's, whatever party it names.
    it('does not count a ruling appeal statement', async () => {
      await expect(
        fileStatement({ defendantId }, [
          {
            category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
            defendantId,
          } as CaseFile,
        ]),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreateEvent).not.toHaveBeenCalled()
    })

    it("refuses the prosecution when only a party's statement is on the case", async () => {
      await expect(
        fileStatement({}, [defendantStatement]),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreateEvent).not.toHaveBeenCalled()
    })

    it('refuses a ruling appeal', async () => {
      await expect(
        fileStatement({ defendantId }, undefined, {
          appealType: AppealCaseType.RULING,
        }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreateEvent).not.toHaveBeenCalled()
    })

    it('refuses a defendant the case does not have', async () => {
      await expect(
        fileStatement({ defendantId: uuid() }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreateEvent).not.toHaveBeenCalled()
    })

    it('refuses a civil claimant the case does not have', async () => {
      await expect(
        fileStatement({ civilClaimantId: uuid() }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreateEvent).not.toHaveBeenCalled()
    })

    it('refuses a request naming two parties', async () => {
      await expect(
        fileStatement({ defendantId, civilClaimantId }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreateEvent).not.toHaveBeenCalled()
    })
  })
})

import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  AppealCaseType,
  AppealEventType,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealStatementDeadlineModule } from './createTestingAppealStatementDeadlineModule'

import { getOrCreateTransaction } from '../../../middleware'
import { runInRequestContext } from '../../../test'
import {
  AppealCase,
  AppealEventLog,
  AppealStatementDeadline,
  Case,
  CivilClaimant,
  Defendant,
} from '../../repository'
import { SetAppealStatementDeadlineDto } from '../dto/setAppealStatementDeadline.dto'

describe('AppealStatementDeadlineController - Set', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const civilClaimantId = uuid()
  const theCase = {
    id: caseId,
    defendants: [{ id: defendantId }] as Defendant[],
    civilClaimants: [{ id: civilClaimantId }] as CivilClaimant[],
  } as Case
  const user = {
    id: uuid(),
    nationalId: '0000000000',
    name: 'Some Person',
    title: 'aðstoðarmaður dómara',
    role: UserRole.COURT_OF_APPEALS_ASSISTANT,
    institution: { name: 'Landsréttur' },
  } as User
  const deadline = new Date(2026, 9, 20)
  const transaction = {} as Transaction

  let mockTransaction: jest.Mock
  let mockCreate: jest.Mock
  let mockUpdate: jest.Mock
  let mockCreateEvent: jest.Mock
  let set: (
    dto: SetAppealStatementDeadlineDto,
    appealCase?: Partial<AppealCase>,
  ) => Promise<AppealStatementDeadline>

  beforeEach(async () => {
    const {
      sequelize,
      appealStatementDeadlineController,
      appealStatementDeadlineRepositoryService,
      appealEventLogRepositoryService,
    } = await createTestingAppealStatementDeadlineModule()

    mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)
    mockCreate = appealStatementDeadlineRepositoryService.create as jest.Mock
    mockCreate.mockImplementation((data) =>
      Promise.resolve({ id: uuid(), ...data } as AppealStatementDeadline),
    )
    mockUpdate = appealStatementDeadlineRepositoryService.update as jest.Mock
    mockUpdate.mockImplementation((id, _appealCaseId, data) =>
      Promise.resolve({ id, ...data } as AppealStatementDeadline),
    )
    mockCreateEvent = appealEventLogRepositoryService.create as jest.Mock
    mockCreateEvent.mockResolvedValue({} as AppealEventLog)

    // The route is guarded by CaseExistsForUpdateGuard, which opens the
    // request transaction before the handler runs. Guards do not execute in
    // controller unit tests, so the request context is set up here instead.
    set = (dto, appealCase = {}) =>
      runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        return appealStatementDeadlineController.set(
          caseId,
          appealCaseId,
          user,
          theCase,
          {
            id: appealCaseId,
            appealType: AppealCaseType.VERDICT,
            ...appealCase,
          } as AppealCase,
          dto,
        )
      })
  })

  describe('a first deadline', () => {
    it('creates the row for a defendant and records who gave it', async () => {
      const result = await set({ defendantId, deadline })

      expect(mockCreate).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          defendantId,
          civilClaimantId: undefined,
          deadline,
        },
        { transaction },
      )
      expect(mockCreateEvent).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.STATEMENT_DEADLINE_SET,
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
      expect(result).toEqual(expect.objectContaining({ defendantId, deadline }))
    })

    it('creates the row for a civil claimant', async () => {
      await set({ civilClaimantId, deadline })

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ civilClaimantId, defendantId: undefined }),
        { transaction },
      )
      expect(mockCreateEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: AppealEventType.STATEMENT_DEADLINE_SET,
          civilClaimantId,
        }),
        { transaction },
      )
    })

    // The prosecution is the party nobody is named for.
    it('creates the row for the prosecution when no party is named', async () => {
      await set({ deadline })

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          defendantId: undefined,
          civilClaimantId: undefined,
        }),
        { transaction },
      )
      expect(mockUpdate).not.toHaveBeenCalled()
    })

    // One call to sequelize.transaction: the guard's. A handler that opened a
    // transaction of its own, the deadlock the controller warns about, would
    // make it two.
    it('joins the transaction the guard opened rather than open one', async () => {
      await set({ defendantId, deadline })

      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })
  })

  describe('an extension', () => {
    const currentId = uuid()
    const current = {
      id: currentId,
      defendantId,
      deadline: new Date(2026, 9, 13),
    } as AppealStatementDeadline

    it('moves the deadline on the row the party has and records the extension', async () => {
      const result = await set(
        { defendantId, deadline },
        { statementDeadlines: [current] },
      )

      expect(mockUpdate).toHaveBeenCalledWith(
        currentId,
        appealCaseId,
        { deadline },
        { transaction },
      )
      expect(mockCreate).not.toHaveBeenCalled()
      expect(mockCreateEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: AppealEventType.STATEMENT_DEADLINE_EXTENDED,
          defendantId,
        }),
        { transaction },
      )
      expect(result).toEqual(
        expect.objectContaining({ id: currentId, deadline }),
      )
    })

    // Another party's row is not this party's: a deadline for the civil
    // claimant alongside is still a first deadline for the defendant.
    it("does not mistake another party's row for an extension", async () => {
      await set(
        { defendantId, deadline },
        {
          statementDeadlines: [
            {
              id: uuid(),
              civilClaimantId,
              deadline,
            } as AppealStatementDeadline,
          ],
        },
      )

      expect(mockCreate).toHaveBeenCalled()
      expect(mockUpdate).not.toHaveBeenCalled()
    })

    it.each([
      ['the same day', new Date(2026, 9, 13)],
      ['an earlier day', new Date(2026, 9, 6)],
    ])('refuses to move the deadline to %s', async (_name, earlier) => {
      await expect(
        set(
          { defendantId, deadline: earlier },
          { statementDeadlines: [current] },
        ),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockUpdate).not.toHaveBeenCalled()
      expect(mockCreateEvent).not.toHaveBeenCalled()
    })
  })

  describe('refusals', () => {
    // The screen locks the date once the statement is in; the same rule
    // where the screen cannot reach.
    it('refuses a deadline for a party whose statement is in', async () => {
      await expect(
        set(
          { defendantId, deadline },
          {
            appealEventLogs: [
              {
                eventType: AppealEventType.APPEAL_STATEMENT_SENT,
                defendantId,
              } as AppealEventLog,
            ],
          },
        ),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreate).not.toHaveBeenCalled()
    })

    // Another party's statement does not lock this party's deadline.
    it('still gives a deadline when only another party has filed', async () => {
      await set(
        { defendantId, deadline },
        {
          appealEventLogs: [
            {
              eventType: AppealEventType.APPEAL_STATEMENT_SENT,
              civilClaimantId,
            } as AppealEventLog,
          ],
        },
      )

      expect(mockCreate).toHaveBeenCalled()
    })

    // The guard matches any of the case's appeals to the id in the URL. A
    // ruling appeal is decided on the papers already filed.
    it('refuses a ruling appeal', async () => {
      await expect(
        set({ defendantId, deadline }, { appealType: AppealCaseType.RULING }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreate).not.toHaveBeenCalled()
    })

    // The ids come from the body, so nothing upstream has checked them
    // against the case.
    it('refuses a defendant the case does not have', async () => {
      await expect(
        set({ defendantId: uuid(), deadline }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreate).not.toHaveBeenCalled()
    })

    it('refuses a civil claimant the case does not have', async () => {
      await expect(
        set({ civilClaimantId: uuid(), deadline }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreate).not.toHaveBeenCalled()
    })

    it('refuses a request naming two parties', async () => {
      await expect(
        set({ defendantId, civilClaimantId, deadline }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(mockCreate).not.toHaveBeenCalled()
    })
  })
})

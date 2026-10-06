import each from 'jest-each'
import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseOrigin,
  CaseState,
  CaseTransition,
  CaseType,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  DefendantEventType,
  IndictmentCaseNotificationType,
  indictmentCases,
  InstitutionType,
  investigationCases,
  isIndictmentCase,
  isRequestCase,
  RequestCaseNotificationType,
  restrictionCases,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import {
  getOrCreateTransaction,
  getTransactionContext,
  TransactionContext,
} from '../../../../middleware'
import { randomDate, runInRequestContext } from '../../../../test'
import { CourtSessionService } from '../../../court-session'
import { EventService } from '../../../event'
import { Case, CaseRepositoryService } from '../../../repository'
import { UserService } from '../../../user'
import { VerdictService } from '../../../verdict'
import { TransitionCaseDto } from '../../dto/transitionCase.dto'

jest.mock('../../../../factories')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  transition: TransitionCaseDto,
) => Promise<Then>

describe('CaseController - Transition', () => {
  const date = randomDate()
  const userId = uuid()
  const defaultUser = {
    id: userId,
    role: UserRole.PROSECUTOR,
    canConfirmIndictment: false,
    institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
  } as User

  let mockQueuedMessages: Message[]
  let transaction: Transaction
  let mockSequelize: Sequelize
  let mockCaseRepositoryService: CaseRepositoryService
  let mockCourtSessionService: CourtSessionService
  let mockVerdictService: VerdictService
  let mockEventService: EventService
  let mockUserService: UserService
  let transactionContext: TransactionContext | undefined
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessages,
      sequelize,
      caseRepositoryService,
      courtSessionService,
      verdictService,
      eventService,
      userService,
      caseController,
    } = await createTestingCaseModule()

    mockQueuedMessages = queuedMessages
    mockSequelize = sequelize
    mockCaseRepositoryService = caseRepositoryService
    mockCourtSessionService = courtSessionService
    mockVerdictService = verdictService
    mockEventService = eventService
    mockUserService = userService
    transactionContext = undefined

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValue(date)
    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue({})

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      transition: TransitionCaseDto,
    ) => {
      const then = {} as Then

      try {
        // The route is guarded by CaseExistsForUpdateGuard, so the request
        // transaction is already open - and holding a lock on this case row -
        // by the time the handler runs. Guards do not execute in controller
        // unit tests, so the request context and that transaction are set up
        // here instead.
        await runInRequestContext(async () => {
          transactionContext = getTransactionContext()

          await getOrCreateTransaction(mockSequelize)

          then.result = await caseController.transition(
            caseId,
            {
              ...defaultUser,
              canConfirmIndictment: isIndictmentCase(theCase.type),
            },
            theCase,
            transition,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  each`
      transition                          | oldState               | newState
      ${CaseTransition.OPEN}              | ${CaseState.NEW}       | ${CaseState.DRAFT}
      ${CaseTransition.SUBMIT}            | ${CaseState.DRAFT}     | ${CaseState.SUBMITTED}
      ${CaseTransition.RECEIVE}           | ${CaseState.SUBMITTED} | ${CaseState.RECEIVED}
      ${CaseTransition.ACCEPT}            | ${CaseState.RECEIVED}  | ${CaseState.ACCEPTED}
      ${CaseTransition.REJECT}            | ${CaseState.RECEIVED}  | ${CaseState.REJECTED}
      ${CaseTransition.DISMISS}           | ${CaseState.RECEIVED}  | ${CaseState.DISMISSED}
      ${CaseTransition.DELETE}            | ${CaseState.NEW}       | ${CaseState.DELETED}
      ${CaseTransition.DELETE}            | ${CaseState.DRAFT}     | ${CaseState.DELETED}
      ${CaseTransition.DELETE}            | ${CaseState.SUBMITTED} | ${CaseState.DELETED}
      ${CaseTransition.DELETE}            | ${CaseState.RECEIVED}  | ${CaseState.DELETED}
      ${CaseTransition.REOPEN}            | ${CaseState.ACCEPTED}  | ${CaseState.RECEIVED}
      ${CaseTransition.REOPEN}            | ${CaseState.REJECTED}  | ${CaseState.RECEIVED}
      ${CaseTransition.REOPEN}            | ${CaseState.DISMISSED} | ${CaseState.RECEIVED}
    `.describe(
    '$transition $oldState case transitioning to $newState case',
    ({ transition, oldState, newState }) => {
      each([...restrictionCases, ...investigationCases]).describe(
        '%s case',
        (type) => {
          const caseId = uuid()
          const policeCaseNumber = uuid()
          const caseFileId1 = uuid()
          const caseFileId2 = uuid()
          const caseFiles = [
            {
              id: caseFileId1,
              key: uuid(),
              isKeyAccessible: true,
              state: CaseFileState.STORED_IN_RVG,
            },
            {
              id: caseFileId2,
              key: uuid(),
              isKeyAccessible: true,
              state: CaseFileState.STORED_IN_COURT,
            },
          ]
          const courtEndTime = randomDate()
          // Completing a request case requires a complete court record
          const appealDecisions = [
            {
              partyRole: AppealDecisionPartyRole.PROSECUTOR,
              decision: CaseAppealDecision.ACCEPT,
            },
            {
              partyRole: AppealDecisionPartyRole.DEFENDANT,
              decision: CaseAppealDecision.ACCEPT,
            },
          ]
          const theCase = {
            id: caseId,
            origin: CaseOrigin.LOKE,
            type,
            policeCaseNumbers: [policeCaseNumber],
            state: oldState,
            caseFiles,
            courtEndTime,
            appealDecisions,
          } as Case
          const updatedCase = {
            id: caseId,
            origin: CaseOrigin.LOKE,
            type,
            policeCaseNumbers: [policeCaseNumber],
            state: newState,
            caseFiles,
            courtEndTime,
            appealDecisions,
          } as Case
          let then: Then

          beforeEach(async () => {
            const mockFindLiveById =
              mockCaseRepositoryService.findLiveById as jest.Mock
            mockFindLiveById.mockResolvedValueOnce(updatedCase)

            then = await givenWhenThen(caseId, theCase, { transition })
          })

          it('should transition the case', () => {
            expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
              caseId,
              {
                state: newState,
                parentCaseId:
                  transition === CaseTransition.DELETE ? null : undefined,
                rulingDate: [
                  CaseTransition.ACCEPT,
                  CaseTransition.REJECT,
                  CaseTransition.DISMISS,
                ].includes(transition)
                  ? isIndictmentCase(type)
                    ? date
                    : courtEndTime
                  : transition === CaseTransition.REOPEN
                  ? null
                  : undefined,
                courtRecordSignatoryId:
                  transition === CaseTransition.REOPEN ? null : undefined,
                courtRecordSignatureDate:
                  transition === CaseTransition.REOPEN ? null : undefined,
              },
              { transaction },
            )

            if (completedRequestCaseStates.includes(newState)) {
              expect(mockQueuedMessages).toEqual([
                {
                  type: MessageType.DELIVERY_TO_COURT_CASE_CONCLUSION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                },
                {
                  type: MessageType.DELIVERY_TO_COURT_COURT_RECORD,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                },
                {
                  type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  elementId: caseFileId1,
                },
                {
                  type: MessageType.DELIVERY_TO_POLICE_CASE,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                },
                {
                  type: MessageType.DELIVERY_TO_POLICE_REQUEST,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                },
                {
                  type: MessageType.DELIVERY_TO_POLICE_COURT_RECORD,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                },
                ...(newState === CaseState.ACCEPTED &&
                [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY].includes(
                  type,
                )
                  ? [
                      {
                        type: MessageType.DELIVERY_TO_POLICE_CUSTODY_NOTICE,
                        user: {
                          ...defaultUser,
                          canConfirmIndictment: isIndictmentCase(theCase.type),
                        },
                        caseId,
                      },
                    ]
                  : []),
              ])
            } else if (newState === CaseState.DELETED) {
              expect(mockQueuedMessages).toEqual([
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: RequestCaseNotificationType.REVOKED },
                },
              ])
            } else if (
              oldState === CaseState.SUBMITTED &&
              newState === CaseState.RECEIVED
            ) {
              expect(mockQueuedMessages).toEqual([
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: RequestCaseNotificationType.RECEIVED_BY_COURT },
                },
              ])
            } else {
              expect(mockQueuedMessages).toEqual([])
            }

            if (transition === CaseTransition.DELETE) {
              expect(then.result).toBe(theCase)
            } else {
              expect(
                mockCaseRepositoryService.findLiveById,
              ).toHaveBeenCalledWith(caseId, {
                allowDeleted: true,
                transaction,
              })
              expect(then.result).toBe(updatedCase)
            }
          })
        },
      )
    },
  )

  each`
      transition                             | oldState                              | newState
      ${CaseTransition.ASK_FOR_CONFIRMATION} | ${CaseState.DRAFT}                    | ${CaseState.WAITING_FOR_CONFIRMATION}
      ${CaseTransition.DENY_INDICTMENT}      | ${CaseState.WAITING_FOR_CONFIRMATION} | ${CaseState.DRAFT}
      ${CaseTransition.SUBMIT}               | ${CaseState.WAITING_FOR_CONFIRMATION} | ${CaseState.SUBMITTED}
      ${CaseTransition.ASK_FOR_CANCELLATION} | ${CaseState.SUBMITTED}                | ${CaseState.WAITING_FOR_CANCELLATION}
      ${CaseTransition.ASK_FOR_CANCELLATION} | ${CaseState.RECEIVED}                 | ${CaseState.WAITING_FOR_CANCELLATION}
      ${CaseTransition.RECEIVE}              | ${CaseState.SUBMITTED}                | ${CaseState.RECEIVED}
      ${CaseTransition.COMPLETE}             | ${CaseState.RECEIVED}                 | ${CaseState.COMPLETED}
      ${CaseTransition.DELETE}               | ${CaseState.DRAFT}                    | ${CaseState.DELETED}
      ${CaseTransition.DELETE}               | ${CaseState.WAITING_FOR_CONFIRMATION} | ${CaseState.DELETED}
    `.describe(
    '$transition $oldState case transitioning to $newState case',
    ({ transition, oldState, newState }) => {
      each(indictmentCases).describe('%s case', (type) => {
        const caseId = uuid()
        const policeCaseNumber = uuid()
        const courtCaseNumber = uuid()
        const caseFileId1 = uuid()
        const caseFileId2 = uuid()
        const caseFiles = [
          {
            id: caseFileId1,
            key: uuid(),
            isKeyAccessible: true,
            state: CaseFileState.STORED_IN_RVG,
            category: CaseFileCategory.COURT_RECORD,
          },
          {
            id: caseFileId2,
            key: uuid(),
            isKeyAccessible: true,
            state: CaseFileState.STORED_IN_COURT,
            category: CaseFileCategory.RULING,
          },
        ]
        const courtEndTime = randomDate()
        const defendants = [{ id: uuid(), name: 'Test Defendant' }]
        const theCase = {
          id: caseId,
          origin: CaseOrigin.LOKE,
          type,
          policeCaseNumbers: [policeCaseNumber],
          courtCaseNumber,
          state: oldState,
          caseFiles,
          courtEndTime,
          defendants,
        } as Case
        const updatedCase = {
          id: caseId,
          origin: CaseOrigin.LOKE,
          type,
          policeCaseNumbers: [policeCaseNumber],
          courtCaseNumber,
          state: newState,
          caseFiles,
          courtEndTime,
          defendants,
        } as Case
        let then: Then

        beforeEach(async () => {
          const mockFindLiveById =
            mockCaseRepositoryService.findLiveById as jest.Mock
          mockFindLiveById.mockResolvedValueOnce(updatedCase)

          then = await givenWhenThen(caseId, theCase, { transition })
        })

        it('should transition the case', () => {
          expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
            caseId,
            {
              state: newState,
              parentCaseId:
                isRequestCase(type) && transition === CaseTransition.DELETE
                  ? null
                  : undefined,
              rulingDate:
                transition === CaseTransition.COMPLETE
                  ? courtEndTime
                  : undefined,
              indictmentDeniedExplanation:
                transition === CaseTransition.SUBMIT ? null : undefined,
            },
            { transaction },
          )

          if (completedIndictmentCaseStates.includes(newState)) {
            expect(mockQueuedMessages).toEqual([
              {
                type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                elementId: caseFileId1,
              },
              {
                type: MessageType.NOTIFICATION,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                body: { type: RequestCaseNotificationType.RULING },
              },
              {
                type: MessageType.DELIVERY_TO_POLICE_INDICTMENT_CASE,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
              },
              {
                // Only court records are delivered to police, not rulings
                type: MessageType.DELIVERY_TO_POLICE_CASE_FILE,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                elementId: caseFileId1,
              },
            ])
          } else if (
            newState === CaseState.DELETED &&
            !isIndictmentCase(theCase.type)
          ) {
            expect(mockQueuedMessages).toEqual([
              {
                type: MessageType.NOTIFICATION,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                body: { type: RequestCaseNotificationType.REVOKED },
              },
            ])
          } else if (newState === CaseState.SUBMITTED) {
            expect(mockQueuedMessages).toEqual([
              {
                type: MessageType.NOTIFICATION,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                body: { type: RequestCaseNotificationType.READY_FOR_COURT },
              },
            ])
          } else if (
            oldState === CaseState.SUBMITTED &&
            newState === CaseState.RECEIVED
          ) {
            expect(mockQueuedMessages).toEqual([
              {
                type: MessageType.NOTIFICATION,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                body: { type: RequestCaseNotificationType.RECEIVED_BY_COURT },
              },
              {
                type: MessageType.DELIVERY_TO_COURT_INDICTMENT_INFO,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
              },
              {
                type: MessageType.DELIVERY_TO_POLICE_INDICTMENT,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
              },
              {
                type: MessageType.DELIVERY_TO_POLICE_CASE_FILES_RECORD,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                elementId: policeCaseNumber,
              },
            ])
          } else if (
            newState === CaseState.DRAFT &&
            oldState === CaseState.WAITING_FOR_CONFIRMATION
          ) {
            expect(mockQueuedMessages).toEqual([
              {
                type: MessageType.NOTIFICATION,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                body: {
                  type: IndictmentCaseNotificationType.INDICTMENT_DENIED,
                },
              },
            ])
          } else if (
            newState === CaseState.WAITING_FOR_CANCELLATION &&
            isIndictmentCase(theCase.type)
          ) {
            expect(mockQueuedMessages).toEqual([
              {
                type: MessageType.NOTIFICATION,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                body: { type: RequestCaseNotificationType.REVOKED },
              },
              {
                type: MessageType.DELIVERY_TO_COURT_INDICTMENT_CANCELLATION_NOTICE,
                user: {
                  ...defaultUser,
                  canConfirmIndictment: isIndictmentCase(theCase.type),
                },
                caseId,
                body: { withCourtCaseNumber: true },
              },
            ])
          } else {
            expect(mockQueuedMessages).toEqual([])
          }

          if (transition === CaseTransition.DELETE) {
            expect(then.result).toBe(theCase)
          } else {
            expect(mockCaseRepositoryService.findLiveById).toHaveBeenCalledWith(
              caseId,
              { allowDeleted: true, transaction },
            )
            expect(then.result).toBe(updatedCase)
          }
        })
      })
    },
  )

  describe('completing an indictment case with a ruling', () => {
    const caseId = uuid()
    const dismissedDefendantId = uuid()
    const activeDefendantId = uuid()
    const defendants = [
      {
        id: dismissedDefendantId,
        eventLogs: [
          {
            eventType: DefendantEventType.INDICTMENT_DISMISSED,
            created: randomDate(),
          },
        ],
      },
      { id: activeDefendantId, eventLogs: [] },
    ]
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: indictmentCases[0],
      policeCaseNumbers: [uuid()],
      courtCaseNumber: uuid(),
      state: CaseState.RECEIVED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      courtEndTime: randomDate(),
      // completeTransitionRule requires the completing user to be the judge of
      // an indictment case that ends in a ruling - guards do not run in
      // controller unit tests, so without this the fixture describes a
      // transition production would reject.
      judgeId: userId,
      defendants,
    } as Case

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce({
        ...theCase,
        state: CaseState.COMPLETED,
      })

      await givenWhenThen(caseId, theCase, {
        transition: CaseTransition.COMPLETE,
      })
    })

    it('should only create verdicts for defendants whose indictment was not cancelled or dismissed', () => {
      expect(mockVerdictService.createVerdict).toHaveBeenCalledTimes(1)
      expect(mockVerdictService.createVerdict).toHaveBeenCalledWith(
        caseId,
        { defendantId: activeDefendantId },
        transaction,
      )
    })
  })

  // An indictment case that completes by merging into a parent case joins the
  // parent's latest court session, provided that session is still open. The
  // court session service owns what joining means; this is the decision to
  // call it. The guard locked this case's row, not the parent's, so the
  // decision is taken on the parent's row - locked here - and from a fresh
  // read of its latest session rather than from the guard's snapshot, which a
  // confirmation or a new session on the parent can have outdated.
  describe('completing an indictment case by merging it into a parent case', () => {
    const caseId = uuid()
    const parentCaseId = uuid()
    const mergingCase = (latestSessionOpenInSnapshot: boolean) =>
      ({
        id: caseId,
        origin: CaseOrigin.LOKE,
        type: indictmentCases[0],
        policeCaseNumbers: [uuid()],
        courtCaseNumber: uuid(),
        state: CaseState.RECEIVED,
        indictmentRulingDecision: CaseIndictmentRulingDecision.MERGE,
        courtEndTime: randomDate(),
        defendants: [{ id: uuid(), eventLogs: [] }],
        mergeCaseId: parentCaseId,
        mergeCase: {
          id: parentCaseId,
          state: CaseState.RECEIVED,
          withCourtSessions: true,
          courtSessions: [
            { id: uuid(), isConfirmed: true },
            { id: uuid(), isConfirmed: !latestSessionOpenInSnapshot },
          ],
        },
      } as unknown as Case)

    beforeEach(() => {
      const mockLockByIdForUpdate =
        mockCaseRepositoryService.lockByIdForUpdate as jest.Mock
      mockLockByIdForUpdate.mockResolvedValue(true)
    })

    each`
      snapshotSaysOpen | freshReadSaysOpen
      ${true}          | ${true}
      ${true}          | ${false}
      ${false}         | ${true}
      ${false}         | ${false}
    `.describe(
      'the guard snapshot says the latest session of the parent is open: $snapshotSaysOpen, the fresh read says: $freshReadSaysOpen',
      ({ snapshotSaysOpen, freshReadSaysOpen }) => {
        const theCase = mergingCase(snapshotSaysOpen)
        let then: Then

        beforeEach(async () => {
          const mockIsLatestCourtSessionOpen =
            mockCourtSessionService.isLatestCourtSessionOpen as jest.Mock
          mockIsLatestCourtSessionOpen.mockResolvedValueOnce(freshReadSaysOpen)
          const mockFindLiveById =
            mockCaseRepositoryService.findLiveById as jest.Mock
          mockFindLiveById.mockResolvedValueOnce({
            ...theCase,
            state: CaseState.COMPLETED,
          })

          then = await givenWhenThen(caseId, theCase, {
            transition: CaseTransition.COMPLETE,
          })
        })

        it('should lock the parent case before reading its latest court session', () => {
          const mockLockByIdForUpdate =
            mockCaseRepositoryService.lockByIdForUpdate as jest.Mock
          const mockIsLatestCourtSessionOpen =
            mockCourtSessionService.isLatestCourtSessionOpen as jest.Mock

          expect(mockLockByIdForUpdate).toHaveBeenCalledWith(
            parentCaseId,
            transaction,
          )
          expect(mockIsLatestCourtSessionOpen).toHaveBeenCalledWith(
            parentCaseId,
            transaction,
          )
          expect(
            mockLockByIdForUpdate.mock.invocationCallOrder[0],
          ).toBeLessThan(
            mockIsLatestCourtSessionOpen.mock.invocationCallOrder[0],
          )
        })

        it(`should ${
          freshReadSaysOpen ? 'add the case to' : 'leave alone'
        } the latest court session of the parent case, as the fresh read says`, () => {
          if (freshReadSaysOpen) {
            expect(
              mockCourtSessionService.addMergedCaseToLatestCourtSession,
            ).toHaveBeenCalledWith(parentCaseId, caseId, transaction)
          } else {
            expect(
              mockCourtSessionService.addMergedCaseToLatestCourtSession,
            ).not.toHaveBeenCalled()
          }
        })

        it('should complete the case', () => {
          expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
            caseId,
            expect.objectContaining({ state: CaseState.COMPLETED }),
            { transaction },
          )
          expect(then.error).toBeUndefined()
        })
      },
    )

    describe('the parent case has no court sessions', () => {
      beforeEach(async () => {
        const theCase = mergingCase(true)
        theCase.mergeCase = {
          ...theCase.mergeCase,
          withCourtSessions: false,
          courtSessions: [],
        } as unknown as Case

        await givenWhenThen(caseId, theCase, {
          transition: CaseTransition.COMPLETE,
        })
      })

      it('should still lock the parent case and leave its court sessions alone', () => {
        expect(
          mockCaseRepositoryService.lockByIdForUpdate,
        ).toHaveBeenCalledWith(parentCaseId, transaction)
        expect(
          mockCourtSessionService.isLatestCourtSessionOpen,
        ).not.toHaveBeenCalled()
        expect(
          mockCourtSessionService.addMergedCaseToLatestCourtSession,
        ).not.toHaveBeenCalled()
      })
    })

    describe('the parent case is gone', () => {
      let then: Then

      beforeEach(async () => {
        const mockLockByIdForUpdate =
          mockCaseRepositoryService.lockByIdForUpdate as jest.Mock
        mockLockByIdForUpdate.mockResolvedValue(false)

        then = await givenWhenThen(caseId, mergingCase(true), {
          transition: CaseTransition.COMPLETE,
        })
      })

      it('should fail the completion', () => {
        expect(then.error).toBeInstanceOf(InternalServerErrorException)
        expect(then.error.message).toBe(
          `Could not find parent case ${parentCaseId} when completing merged case ${caseId}`,
        )
        expect(
          mockCourtSessionService.addMergedCaseToLatestCourtSession,
        ).not.toHaveBeenCalled()
      })
    })
  })

  describe('indictment case with 0 defendants', () => {
    each(indictmentCases).describe('%s case', (type) => {
      it('should reject ASK_FOR_CONFIRMATION and not call update', async () => {
        const caseId = uuid()
        const policeCaseNumber = uuid()
        const theCaseWithNoDefendants = {
          id: caseId,
          origin: CaseOrigin.LOKE,
          type,
          policeCaseNumbers: [policeCaseNumber],
          state: CaseState.DRAFT,
          defendants: [],
        } as unknown as Case

        const then = await givenWhenThen(caseId, theCaseWithNoDefendants, {
          transition: CaseTransition.ASK_FOR_CONFIRMATION,
        })

        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(then.error?.message).toContain(
          'Cannot submit indictment to court without at least one defendant',
        )
        expect(mockCaseRepositoryService.update).not.toHaveBeenCalled()
      })
    })
  })

  describe('the request transaction and the transition event', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      origin: CaseOrigin.LOKE,
      type: restrictionCases[0],
      policeCaseNumbers: [uuid()],
      state: CaseState.NEW,
    } as Case
    const updatedCase = { ...theCase, state: CaseState.DRAFT } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(updatedCase)

      then = await givenWhenThen(caseId, theCase, {
        transition: CaseTransition.OPEN,
      })
    })

    it('should write in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for CaseExistsForUpdateGuard above. A second call
      // would be the handler opening a transaction of its own, which would
      // block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { state: CaseState.DRAFT, parentCaseId: undefined },
        { transaction },
      )
      expect(then.result).toBe(updatedCase)
    })

    it('should register the transition event rather than posting it inline', () => {
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(1)
    })

    it('should post the transition event once the transaction has committed', async () => {
      await Promise.all(
        (transactionContext?.afterCommit ?? []).map((callback) => callback()),
      )

      expect(mockEventService.postEvent).toHaveBeenCalledWith(
        CaseTransition.OPEN,
        updatedCase,
      )
    })
  })

  // Each review transition notifies through its own helper in the case
  // service; none of them is covered by the state table above
  each`
    transition                       | oldState                        | newState                              | notificationType
    ${CaseTransition.ASK_FOR_REVIEW} | ${CaseState.DRAFT}              | ${CaseState.WAITING_FOR_REVIEW}       | ${IndictmentCaseNotificationType.INDICTMENT_SENT_FOR_REVIEW}
    ${CaseTransition.ACCEPT_REVIEW}  | ${CaseState.WAITING_FOR_REVIEW} | ${CaseState.WAITING_FOR_CONFIRMATION} | ${IndictmentCaseNotificationType.INDICTMENT_REVIEW_ACCEPTED}
    ${CaseTransition.DENY_REVIEW}    | ${CaseState.WAITING_FOR_REVIEW} | ${CaseState.DRAFT}                    | ${IndictmentCaseNotificationType.INDICTMENT_REVIEW_DENIED}
  `.describe(
    '$transition indictment case transitioning from $oldState to $newState',
    ({ transition, oldState, newState, notificationType }) => {
      const caseId = uuid()
      const prosecutorsOfficeId = uuid()
      // The asker may not be the approver, while accepting and denying are
      // the approver's own transitions - and only the approver's denial
      // notifies
      const indictmentApproverId =
        transition === CaseTransition.ASK_FOR_REVIEW ? uuid() : userId
      const theCase = {
        id: caseId,
        type: CaseType.INDICTMENT,
        policeCaseNumbers: [uuid()],
        state: oldState,
        defendants: [{ id: uuid() }],
        indictmentApproverId,
        prosecutorsOfficeId,
      } as Case
      const updatedCase = { ...theCase, state: newState } as Case
      let then: Then

      beforeEach(async () => {
        if (transition === CaseTransition.ASK_FOR_REVIEW) {
          // The route validates the approver before asking for review
          const mockFindById = mockUserService.findById as jest.Mock
          mockFindById.mockResolvedValueOnce({
            id: indictmentApproverId,
            active: true,
            role: UserRole.PROSECUTOR,
            institutionId: prosecutorsOfficeId,
          })
        }
        const mockFindLiveById =
          mockCaseRepositoryService.findLiveById as jest.Mock
        mockFindLiveById.mockResolvedValueOnce(updatedCase)

        then = await givenWhenThen(caseId, theCase, { transition })
      })

      it('should transition the case', () => {
        expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
          caseId,
          expect.objectContaining({ state: newState }),
          { transaction },
        )
        expect(then.result).toBe(updatedCase)
      })

      it(`should queue the ${notificationType} notification and nothing else`, () => {
        expect(mockQueuedMessages).toEqual([
          {
            type: MessageType.NOTIFICATION,
            user: { ...defaultUser, canConfirmIndictment: true },
            caseId,
            body: { type: notificationType },
          },
        ])
      })
    },
  )
})

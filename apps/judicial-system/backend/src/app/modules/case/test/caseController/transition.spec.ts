import each from 'jest-each'
import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import { Message, MessageType } from '@island.is/judicial-system/message'
import {
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
import { EventService } from '../../../event'
import { Case, caseInclude, CaseRepositoryService } from '../../../repository'
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
  let mockVerdictService: VerdictService
  let mockEventService: EventService
  let transactionContext: TransactionContext | undefined
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      queuedMessages,
      sequelize,
      caseRepositoryService,
      verdictService,
      eventService,
      caseController,
    } = await createTestingCaseModule()

    mockQueuedMessages = queuedMessages
    mockSequelize = sequelize
    mockCaseRepositoryService = caseRepositoryService
    mockVerdictService = verdictService
    mockEventService = eventService
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
          const theCase = {
            id: caseId,
            origin: CaseOrigin.LOKE,
            type,
            policeCaseNumbers: [policeCaseNumber],
            state: oldState,
            caseFiles,
            courtEndTime,
          } as Case
          const updatedCase = {
            id: caseId,
            origin: CaseOrigin.LOKE,
            type,
            policeCaseNumbers: [policeCaseNumber],
            state: newState,
            caseFiles,
            courtEndTime,
          } as Case
          let then: Then

          beforeEach(async () => {
            const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
            mockFindOne.mockResolvedValueOnce(updatedCase)

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
              expect(mockCaseRepositoryService.findOne).toHaveBeenCalledWith({
                include: caseInclude,
                where: {
                  id: caseId,
                  isArchived: false,
                },
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
          const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
          mockFindOne.mockResolvedValueOnce(updatedCase)

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
            expect(mockCaseRepositoryService.findOne).toHaveBeenCalledWith({
              include: caseInclude,
              where: {
                id: caseId,
                isArchived: false,
              },
              transaction,
            })
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
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce({
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
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(updatedCase)

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
})

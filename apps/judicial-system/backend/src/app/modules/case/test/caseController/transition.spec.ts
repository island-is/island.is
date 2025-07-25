import each from 'jest-each'
import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { ConfigType } from '@island.is/nest/config'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseFileCategory,
  CaseFileState,
  CaseNotificationType,
  CaseOrigin,
  CaseState,
  CaseTransition,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  indictmentCases,
  InstitutionType,
  investigationCases,
  isIndictmentCase,
  isRequestCase,
  restrictionCases,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { caseModuleConfig } from '../../case.config'
import { include } from '../../case.service'
import { TransitionCaseDto } from '../../dto/transitionCase.dto'
import { Case } from '../../models/case.model'

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

  let mockMessageService: MessageService
  let transaction: Transaction
  let mockConfig: ConfigType<typeof caseModuleConfig>
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { messageService, sequelize, caseConfig, caseModel, caseController } =
      await createTestingCaseModule()

    mockMessageService = messageService
    mockConfig = caseConfig
    mockCaseModel = caseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValue(date)
    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      transition: TransitionCaseDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.transition(
          caseId,
          {
            ...defaultUser,
            canConfirmIndictment: isIndictmentCase(theCase.type),
          },
          theCase,
          transition,
        )
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
              state: CaseFileState.STORED_IN_RVG,
            },
            {
              id: caseFileId2,
              key: uuid(),
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
            const mockFindOne = mockCaseModel.findOne as jest.Mock
            mockFindOne.mockResolvedValueOnce(updatedCase)

            then = await givenWhenThen(caseId, theCase, { transition })
          })

          it('should transition the case', () => {
            expect(mockCaseModel.update).toHaveBeenCalledWith(
              {
                state: newState,
                parentCaseId:
                  transition === CaseTransition.DELETE ? null : undefined,
                courtCaseNumber:
                  transition === CaseTransition.RETURN_INDICTMENT
                    ? ''
                    : undefined,
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
              { where: { id: caseId }, transaction },
            )

            if (completedRequestCaseStates.includes(newState)) {
              expect(
                mockMessageService.sendMessagesToQueue,
              ).toHaveBeenCalledWith([
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
              ])
            } else if (newState === CaseState.DELETED) {
              expect(
                mockMessageService.sendMessagesToQueue,
              ).toHaveBeenCalledWith([
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.REVOKED },
                },
              ])
            } else if (
              oldState === CaseState.SUBMITTED &&
              newState === CaseState.RECEIVED
            ) {
              expect(
                mockMessageService.sendMessagesToQueue,
              ).toHaveBeenCalledWith([
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.RECEIVED_BY_COURT },
                },
              ])
            } else {
              expect(
                mockMessageService.sendMessagesToQueue,
              ).not.toHaveBeenCalled()
            }

            if (transition === CaseTransition.DELETE) {
              expect(then.result).toBe(theCase)
            } else {
              expect(mockCaseModel.findOne).toHaveBeenCalledWith({
                include,
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
      ${CaseTransition.RETURN_INDICTMENT}    | ${CaseState.RECEIVED}                 | ${CaseState.DRAFT}
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
            state: CaseFileState.STORED_IN_RVG,
          },
          {
            id: caseFileId2,
            key: uuid(),
            state: CaseFileState.STORED_IN_COURT,
          },
        ]
        const courtEndTime = randomDate()
        const theCase = {
          id: caseId,
          origin: CaseOrigin.LOKE,
          type,
          policeCaseNumbers: [policeCaseNumber],
          courtCaseNumber,
          state: oldState,
          caseFiles,
          courtEndTime,
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
        } as Case
        let then: Then

        beforeEach(async () => {
          const mockFindOne = mockCaseModel.findOne as jest.Mock
          mockFindOne.mockResolvedValueOnce(updatedCase)

          then = await givenWhenThen(caseId, theCase, { transition })
        })

        it('should transition the case', () => {
          expect(mockCaseModel.update).toHaveBeenCalledWith(
            {
              state: newState,
              parentCaseId:
                isRequestCase(type) && transition === CaseTransition.DELETE
                  ? null
                  : undefined,
              courtCaseNumber:
                transition === CaseTransition.RETURN_INDICTMENT
                  ? null
                  : undefined,
              indictmentHash:
                transition === CaseTransition.RETURN_INDICTMENT
                  ? null
                  : undefined,
              rulingDate:
                transition === CaseTransition.COMPLETE
                  ? courtEndTime
                  : undefined,
              indictmentDeniedExplanation:
                transition === CaseTransition.SUBMIT ? null : undefined,
              indictmentReturnedExplanation:
                transition === CaseTransition.ASK_FOR_CONFIRMATION
                  ? null
                  : undefined,
            },
            { where: { id: caseId }, transaction },
          )

          if (completedIndictmentCaseStates.includes(newState)) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.RULING },
                },
                {
                  type: MessageType.DELIVERY_TO_POLICE_INDICTMENT_CASE,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                },
              ],
            )
          } else if (
            newState === CaseState.DELETED &&
            !isIndictmentCase(theCase.type)
          ) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.REVOKED },
                },
              ],
            )
          } else if (newState === CaseState.SUBMITTED) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.READY_FOR_COURT },
                },
              ],
            )
          } else if (
            oldState === CaseState.SUBMITTED &&
            newState === CaseState.RECEIVED
          ) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.RECEIVED_BY_COURT },
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
              ],
            )
          } else if (
            newState === CaseState.DRAFT &&
            oldState === CaseState.RECEIVED
          ) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.INDICTMENT_RETURNED },
                },
              ],
            )
          } else if (
            newState === CaseState.DRAFT &&
            oldState === CaseState.WAITING_FOR_CONFIRMATION
          ) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.INDICTMENT_DENIED },
                },
              ],
            )
          } else if (
            newState === CaseState.WAITING_FOR_CANCELLATION &&
            isIndictmentCase(theCase.type)
          ) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.REVOKED },
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
              ],
            )
          } else {
            expect(
              mockMessageService.sendMessagesToQueue,
            ).not.toHaveBeenCalled()
          }

          if (transition === CaseTransition.DELETE) {
            expect(then.result).toBe(theCase)
          } else {
            expect(mockCaseModel.findOne).toHaveBeenCalledWith({
              include,
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

  each`
      transition                        | caseState                    | currentAppealState           | newAppealState
      ${CaseTransition.APPEAL}          | ${CaseState.ACCEPTED}        | ${undefined}                 | ${CaseAppealState.APPEALED}
      ${CaseTransition.RECEIVE_APPEAL}  | ${CaseState.ACCEPTED}        | ${CaseAppealState.APPEALED}  | ${CaseAppealState.RECEIVED}
      ${CaseTransition.COMPLETE_APPEAL} | ${CaseState.ACCEPTED}        | ${CaseAppealState.RECEIVED}  | ${CaseAppealState.COMPLETED}
      ${CaseTransition.REOPEN_APPEAL}   | ${CaseState.ACCEPTED}        | ${CaseAppealState.COMPLETED} | ${CaseAppealState.RECEIVED}
      ${CaseTransition.WITHDRAW_APPEAL} | ${CaseState.ACCEPTED}        | ${CaseAppealState.APPEALED}  | ${CaseAppealState.WITHDRAWN}
      ${CaseTransition.WITHDRAW_APPEAL} | ${CaseState.ACCEPTED}        | ${CaseAppealState.RECEIVED}  | ${CaseAppealState.WITHDRAWN}


    `.describe(
    '$transition $caseState case transitioning from $currentAppealState to $newAppealState appeal state',
    ({ transition, caseState, currentAppealState, newAppealState }) => {
      each([...restrictionCases, ...investigationCases]).describe(
        '%s case',
        (type) => {
          const caseId = uuid()
          const prosecutorAppealBriefId = uuid()
          const prosecutorAppealBriefCaseFileId1 = uuid()
          const prosecutorAppealBriefCaseFileId2 = uuid()
          const appealRulingId = uuid()
          const caseFiles = [
            {
              id: prosecutorAppealBriefId,
              key: uuid(),
              state: CaseFileState.STORED_IN_RVG,
              category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
            },
            {
              id: prosecutorAppealBriefCaseFileId1,
              key: uuid(),
              state: CaseFileState.STORED_IN_RVG,
              category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
            },
            {
              id: prosecutorAppealBriefCaseFileId2,
              key: uuid(),
              state: CaseFileState.STORED_IN_RVG,
              category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
            },
            {
              id: appealRulingId,
              key: uuid(),
              state: CaseFileState.STORED_IN_RVG,
              category: CaseFileCategory.APPEAL_RULING,
            },
          ]
          const theCase = {
            id: caseId,
            type,
            state: caseState,
            caseFiles,
            appealState: currentAppealState,
            origin: CaseOrigin.LOKE,
          } as Case

          const updatedCase = {
            id: caseId,
            type,
            state: caseState,
            caseFiles,
            appealState: newAppealState,
            origin: CaseOrigin.LOKE,
          } as Case

          beforeEach(async () => {
            const mockFindOne = mockCaseModel.findOne as jest.Mock
            mockFindOne.mockResolvedValueOnce(updatedCase)

            await givenWhenThen(caseId, theCase, {
              transition,
            })
          })

          it('should transition the case', () => {
            expect(mockCaseModel.update).toHaveBeenCalledWith(
              {
                appealState: newAppealState,
                prosecutorPostponedAppealDate:
                  transition === CaseTransition.APPEAL ? date : undefined,
                appealReceivedByCourtDate:
                  transition === CaseTransition.RECEIVE_APPEAL
                    ? date
                    : undefined,
                appealRulingDecision:
                  transition === CaseTransition.WITHDRAW_APPEAL &&
                  currentAppealState === CaseAppealState.RECEIVED
                    ? CaseAppealRulingDecision.DISCONTINUED
                    : undefined,
              },
              { where: { id: caseId }, transaction },
            )
          })

          it('should send notifications to queue when case is appealed', () => {
            if (transition === CaseTransition.APPEAL) {
              expect(
                mockMessageService.sendMessagesToQueue,
              ).toHaveBeenCalledWith([
                {
                  type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  elementId: prosecutorAppealBriefId,
                },
                {
                  type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  elementId: prosecutorAppealBriefCaseFileId1,
                },
                {
                  type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  elementId: prosecutorAppealBriefCaseFileId2,
                },
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: {
                    type: CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS,
                  },
                },
              ])
            }
          })

          it('should send notifications to queue when appeal is received', () => {
            if (transition === CaseTransition.RECEIVE_APPEAL) {
              expect(
                mockMessageService.sendMessagesToQueue,
              ).toHaveBeenCalledWith([
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.APPEAL_RECEIVED_BY_COURT },
                },
              ])
            }
          })

          it('should send notifications to queue when appeal is completed', () => {
            if (transition === CaseTransition.COMPLETE_APPEAL) {
              expect(
                mockMessageService.sendMessagesToQueue,
              ).toHaveBeenCalledWith([
                {
                  type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  elementId: appealRulingId,
                },
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.APPEAL_COMPLETED },
                },
                {
                  type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CONCLUSION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  nextRetry:
                    date.getTime() + mockConfig.robotMessageDelay * 1000,
                },
                {
                  type: MessageType.DELIVERY_TO_POLICE_APPEAL,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId: theCase.id,
                },
              ])
            }
          })

          it('should send notifications to queue when appeal is withdrawn', () => {
            if (transition === CaseTransition.WITHDRAW_APPEAL) {
              expect(
                mockMessageService.sendMessagesToQueue,
              ).toHaveBeenCalledWith([
                {
                  type: MessageType.NOTIFICATION,
                  user: {
                    ...defaultUser,
                    canConfirmIndictment: isIndictmentCase(theCase.type),
                  },
                  caseId,
                  body: { type: CaseNotificationType.APPEAL_WITHDRAWN },
                },
              ])
            }
          })
        },
      )
    },
  )
})

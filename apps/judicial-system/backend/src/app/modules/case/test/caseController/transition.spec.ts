import each from 'jest-each'
import { uuid } from 'uuidv4'
import { Transaction } from 'sequelize'

import {
  CaseAppealState,
  CaseFileCategory,
  CaseFileState,
  CaseState,
  CaseTransition,
  completedCaseStates,
  indictmentCases,
  investigationCases,
  isIndictmentCase,
  restrictionCases,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { MessageService, MessageType } from '@island.is/judicial-system/message'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { TransitionCaseDto } from '../../dto/transitionCase.dto'
import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'
import { order, include } from '../../case.service'

jest.mock('../../../factories')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  transition: TransitionCaseDto,
  user?: User,
) => Promise<Then>

describe('CaseController - Transition', () => {
  const date = randomDate()
  const userId = uuid()
  const defaultUser = { id: userId } as User

  let mockMessageService: MessageService
  let transaction: Transaction
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      sequelize,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockCaseModel = caseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      transition: TransitionCaseDto,
      user?: User,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.transition(
          caseId,
          user ?? defaultUser,
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
      transition                | oldState               | newState
      ${CaseTransition.OPEN}    | ${CaseState.NEW}       | ${CaseState.DRAFT}
      ${CaseTransition.SUBMIT}  | ${CaseState.DRAFT}     | ${CaseState.SUBMITTED}
      ${CaseTransition.RECEIVE} | ${CaseState.SUBMITTED} | ${CaseState.RECEIVED}
      ${CaseTransition.ACCEPT}  | ${CaseState.RECEIVED}  | ${CaseState.ACCEPTED}
      ${CaseTransition.REJECT}  | ${CaseState.RECEIVED}  | ${CaseState.REJECTED}
      ${CaseTransition.DISMISS} | ${CaseState.RECEIVED}  | ${CaseState.DISMISSED}
      ${CaseTransition.DELETE}  | ${CaseState.NEW}       | ${CaseState.DELETED}
      ${CaseTransition.DELETE}  | ${CaseState.DRAFT}     | ${CaseState.DELETED}
      ${CaseTransition.DELETE}  | ${CaseState.SUBMITTED} | ${CaseState.DELETED}
      ${CaseTransition.DELETE}  | ${CaseState.RECEIVED}  | ${CaseState.DELETED}
    `.describe(
    '$transition $oldState case transitioning to $newState case',
    ({ transition, oldState, newState }) => {
      each([
        ...restrictionCases,
        ...investigationCases,
        ...indictmentCases,
      ]).describe('%s case', (type) => {
        const caseId = uuid()
        const caseFileId1 = uuid()
        const caseFileId2 = uuid()
        const theCase = {
          id: caseId,
          type,
          state: oldState,
          caseFiles: [
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
          ],
        } as Case
        const updatedCase = { id: caseId, type, state: newState } as Case
        let then: Then

        beforeEach(async () => {
          const mockFindOne = mockCaseModel.findOne as jest.Mock
          mockFindOne.mockResolvedValueOnce(updatedCase)

          then = await givenWhenThen(caseId, theCase, {
            transition,
          })
        })

        it('should transition the case', () => {
          expect(mockCaseModel.update).toHaveBeenCalledWith(
            {
              state: newState,
              parentCaseId:
                transition === CaseTransition.DELETE ? null : undefined,
              courtRecordSignatoryId:
                transition === CaseTransition.REOPEN ? null : undefined,
              courtRecordSignatureDate:
                transition === CaseTransition.REOPEN ? null : undefined,
            },
            { where: { id: caseId }, transaction },
          )

          if (
            isIndictmentCase(type) &&
            completedCaseStates.includes(newState)
          ) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.ARCHIVE_CASE_FILE,
                  user: defaultUser,
                  caseId,
                  caseFileId: caseFileId1,
                },
                {
                  type: MessageType.ARCHIVE_CASE_FILE,
                  user: defaultUser,
                  caseId,
                  caseFileId: caseFileId2,
                },
                {
                  type: MessageType.SEND_RULING_NOTIFICATION,
                  user: defaultUser,
                  caseId,
                },
              ],
            )
          } else if (isIndictmentCase(type) && newState === CaseState.DELETED) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.SEND_REVOKED_NOTIFICATION,
                  user: defaultUser,
                  caseId,
                },
                {
                  type: MessageType.ARCHIVE_CASE_FILE,
                  user: defaultUser,
                  caseId,
                  caseFileId: caseFileId1,
                },
                {
                  type: MessageType.ARCHIVE_CASE_FILE,
                  user: defaultUser,
                  caseId,
                  caseFileId: caseFileId2,
                },
              ],
            )
          } else if (
            isIndictmentCase(type) &&
            newState === CaseState.SUBMITTED
          ) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.SEND_READY_FOR_COURT_NOTIFICATION,
                  user: defaultUser,
                  caseId,
                },
              ],
            )
          } else if (newState === CaseState.RECEIVED) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.SEND_RECEIVED_BY_COURT_NOTIFICATION,
                  user: defaultUser,
                  caseId,
                },
              ],
            )
          } else if (newState === CaseState.DELETED) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith(
              [
                {
                  type: MessageType.SEND_REVOKED_NOTIFICATION,
                  user: defaultUser,
                  caseId,
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
              order,
              where: {
                id: caseId,
                isArchived: false,
              },
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
          ]
          const theCase = {
            id: caseId,
            type,
            state: caseState,
            caseFiles,
            appealState: currentAppealState,
          } as Case

          const updatedCase = {
            id: caseId,
            type,
            state: caseState,
            caseFiles,
            appealState: CaseAppealState.APPEALED,
            prosecutorPostponedAppealDate: date,
          } as Case

          const prosecutorUser = {
            id: userId,
            role: UserRole.PROSECUTOR,
          } as User

          beforeEach(async () => {
            const mockFindOne = mockCaseModel.findOne as jest.Mock
            mockFindOne.mockResolvedValueOnce(updatedCase)

            await givenWhenThen(
              caseId,
              theCase,
              {
                transition,
              },
              prosecutorUser,
            )
          })

          it('should transition the case', () => {
            expect(mockCaseModel.update).toHaveBeenCalledWith(
              expect.objectContaining({
                appealState: newAppealState,
              }),
              { where: { id: caseId }, transaction },
            )
          })

          it('should send notifications to queue when case is appealed', () => {
            if (transition === CaseTransition.APPEAL) {
              expect(
                mockMessageService.sendMessagesToQueue,
              ).toHaveBeenCalledWith([
                ...(currentAppealState
                  ? []
                  : [
                      {
                        type: MessageType.DELIVER_CASE_FILE_TO_COURT,
                        user: prosecutorUser,
                        caseId,
                        caseFileId: prosecutorAppealBriefId,
                      },
                      {
                        type: MessageType.DELIVER_CASE_FILE_TO_COURT,
                        user: prosecutorUser,
                        caseId,
                        caseFileId: prosecutorAppealBriefCaseFileId1,
                      },
                      {
                        type: MessageType.DELIVER_CASE_FILE_TO_COURT,
                        user: prosecutorUser,
                        caseId,
                        caseFileId: prosecutorAppealBriefCaseFileId2,
                      },
                    ]),
                {
                  type:
                    MessageType.SEND_APPEAL_TO_COURT_OF_APPEALS_NOTIFICATION,
                  user: prosecutorUser,
                  caseId,
                },
              ])
            }
          })
        },
      )
    },
  )
})

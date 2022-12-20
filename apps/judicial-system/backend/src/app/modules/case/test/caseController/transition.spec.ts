import each from 'jest-each'
import { uuid } from 'uuidv4'
import { Op, Transaction } from 'sequelize'

import {
  CaseState,
  CaseTransition,
  completedCaseStates,
  indictmentCases,
  investigationCases,
  isIndictmentCase,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'
import { MessageService } from '@island.is/judicial-system/message'

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
) => Promise<Then>

describe('CaseController - Transition', () => {
  const date = randomDate()
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
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.transition(
          caseId,
          { id: uuid() } as User,
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
        const theCase = { id: caseId, type, state: oldState } as Case
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
              rulingDate:
                isIndictmentCase(type) && completedCaseStates.includes(newState)
                  ? date
                  : undefined,
            },
            { where: { id: caseId }, transaction },
          )

          if (
            isIndictmentCase(type) &&
            completedCaseStates.includes(newState)
          ) {
            expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalled()
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
                state: { [Op.not]: CaseState.DELETED },
                isArchived: false,
              },
            })
            expect(then.result).toBe(updatedCase)
          }
        })
      })
    },
  )
})

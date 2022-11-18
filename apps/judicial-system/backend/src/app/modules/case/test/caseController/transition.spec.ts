import each from 'jest-each'
import { uuid } from 'uuidv4'
import { Op } from 'sequelize'

import {
  CaseState,
  CaseTransition,
  completedCaseStates,
  indictmentCases,
  investigationCases,
  isIndictmentCase,
  restrictionCases,
} from '@island.is/judicial-system/types'
import { MessageService } from '@island.is/judicial-system/message'

import { TransitionCaseDto } from '../../dto/transitionCase.dto'
import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'
import { defendantsOrder, includes } from '../../case.service'

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
  let mockMessageService: MessageService
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      messageService,
      caseModel,
      caseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockCaseModel = caseModel

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      transition: TransitionCaseDto,
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.transition(
          caseId,
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
      ]).describe('restriction case', (type) => {
        const caseId = uuid()
        const theCase = { id: caseId, type, state: oldState } as Case
        const updatedCase = { id: caseId, type, state: newState } as Case
        let then: Then

        beforeEach(async () => {
          const mockUpdate = mockCaseModel.update as jest.Mock
          mockUpdate.mockResolvedValueOnce([1])
          transition !== CaseTransition.DELETE &&
            (mockCaseModel.findOne as jest.Mock).mockResolvedValueOnce(
              updatedCase,
            )

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
            },
            { where: { id: caseId } },
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
              include: includes,
              order: [defendantsOrder],
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

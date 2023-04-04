import each from 'jest-each'
import { uuid } from 'uuidv4'
import { Transaction } from 'sequelize'

import {
  CaseAppealState,
  CaseState,
  CaseTransition,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { TransitionCaseDto } from '../../dto/transitionCase.dto'
import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'

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

describe('LimitedCaseController - Transition', () => {
  const date = randomDate()

  let transaction: Transaction
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      caseModel,
      limitedAccessCaseController,
    } = await createTestingCaseModule()

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
        then.result = await limitedAccessCaseController.transition(
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
      transition                        | caseState                        | newAppealState
      ${CaseTransition.APPEAL}          | ${CaseState.ACCEPTED}            | ${CaseAppealState.APPEALED}
      ${CaseTransition.APPEAL}          | ${CaseState.REJECTED}            | ${CaseAppealState.APPEALED}
    
    `.describe(
    '$transition $caseState case transitioning from $currentAppealState to $newAppealState appeal state',
    ({ transition, caseState, currentAppealState, newAppealState }) => {
      each([...restrictionCases, ...investigationCases]).describe(
        '%s case',
        (type) => {
          const caseId = uuid()
          const theCase = {
            id: caseId,
            type,
            state: caseState,
          } as Case

          const updatedCase = {
            id: caseId,
            type,
            state: caseState,
            appealState: CaseAppealState.APPEALED,
            accusedPostponedAppealDate: date,
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
                accusedPostponedAppealDate: currentAppealState
                  ? undefined
                  : date,
              },
              { returning: true, where: { id: caseId } },
            )
          })
        },
      )
    },
  )

  describe('Transition to RECEIVED appeal state', () => {
    const caseId = uuid()
    const theCase = {
      id: caseId,
      state: CaseState.ACCEPTED,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, {
        transition: CaseTransition.RECEIVE_APPEAL,
      })
    })

    it('should fail', () => {
      expect(mockCaseModel.update).not.toHaveBeenCalled()
    })
  })
})

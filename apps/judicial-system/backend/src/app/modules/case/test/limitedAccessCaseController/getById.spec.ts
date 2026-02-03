import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { type User, UserRole } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { Case, CaseRepositoryService } from '../../../repository'

jest.mock('../../../../factories')
interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  user?: User,
) => Promise<Then>

describe('LimitedAccessCaseController - Get by id', () => {
  const openedBeforeDate = randomDate()
  const openedNowDate = randomDate()
  const caseId = uuid()
  const defaultUser = { id: uuid() } as User

  let mockCaseRepositoryService: CaseRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { sequelize, caseRepositoryService, limitedAccessCaseController } =
      await createTestingCaseModule()

    const updatedCase = {
      id: caseId,
      openedByDefender: openedNowDate,
    } as Case

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(openedNowDate)
    mockCaseRepositoryService = caseRepositoryService
    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue(updatedCase)
    const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
    mockFindOne.mockResolvedValue(updatedCase)

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      user = defaultUser,
    ) => {
      const then = {} as Then

      try {
        then.result = await limitedAccessCaseController.getById(
          caseId,
          theCase,
          user,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case exists', () => {
    const theCase = {
      id: caseId,
      openedByDefender: openedBeforeDate,
    } as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should return the case', () => {
      expect(then.result).toBe(theCase)
      expect(mockCaseRepositoryService.update).toHaveBeenCalledTimes(0)
    })
  })

  describe('case exists and has not been opened by defender before', () => {
    const theCase = { id: caseId } as Case
    const user = { ...defaultUser, role: UserRole.DEFENDER } as User
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, user)
    })

    it('should update openedByDefender and return case', () => {
      expect(then.result.openedByDefender).toBe(openedNowDate)
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        { openedByDefender: openedNowDate },
        { transaction },
      )
    })
  })
})

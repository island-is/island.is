import { uuid } from 'uuidv4'

import { type User, UserRole } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { Case } from '../../../repository'

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
  let givenWhenThen: GivenWhenThen
  const openedBeforeDate = randomDate()
  const openedNowDate = randomDate()
  const caseId = uuid()
  const defaultUser = { id: uuid() } as User

  let mockCaseModel: typeof Case

  beforeEach(async () => {
    const { caseModel, limitedAccessCaseController } =
      await createTestingCaseModule()

    const updatedCase = {
      id: caseId,
      openedByDefender: openedNowDate,
    } as Case

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(openedNowDate)
    mockCaseModel = caseModel
    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])
    const mockFindOne = mockCaseModel.findOne as jest.Mock
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
      expect(mockCaseModel.update).toHaveBeenCalledTimes(0)
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
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { openedByDefender: openedNowDate },
        { where: { id: caseId } },
      )
    })
  })
})

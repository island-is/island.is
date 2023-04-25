import { uuid } from 'uuidv4'

import { User } from '@island.is/judicial-system/types'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'

jest.mock('../../../factories')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('LimitedAccessCaseController - Update', () => {
  const date = randomDate()
  const userId = uuid()
  const user = { id: userId } as User
  const caseId = uuid()
  const theCase = {
    id: caseId,
  } as Case
  const updateDto = { defendantStatementDate: new Date() }
  const updatedCase = { ...theCase, defendantStatementDate: date } as Case

  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      caseModel,
      limitedAccessCaseController,
    } = await createTestingCaseModule()

    mockCaseModel = caseModel

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])
    const mockFindOne = mockCaseModel.findOne as jest.Mock
    mockFindOne.mockResolvedValue(updatedCase)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await limitedAccessCaseController.update(
          caseId,
          user,
          theCase,
          updateDto,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendant statement date updated', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should update the case', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { defendantStatementDate: date },
        { where: { id: caseId } },
      )
    })

    it('should return the updated case', () => {
      expect(then.result).toEqual(updatedCase)
    })
  })
})

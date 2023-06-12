import { uuid } from 'uuidv4'
import type { User } from '@island.is/judicial-system/types'

import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'
interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('LimitedAccessCaseController - Get by id', () => {
  let givenWhenThen: GivenWhenThen
  const user = { id: uuid() } as User

  let mockCaseModel: typeof Case

  beforeEach(async () => {
    const {
      caseModel,
      limitedAccessCaseController,
    } = await createTestingCaseModule()

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      mockCaseModel = caseModel
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValue([1])
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValue(theCase)

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
    const caseId = uuid()
    const theCase = { id: caseId } as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should return the case', () => {
      expect(then.result).toBe(theCase)
    })
  })
})

import { uuid } from 'uuidv4'

import { User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case } from '../../../repository'
import { caseListInclude } from '../../case.service'
import { getCasesQueryFilter } from '../../filters/cases.filter'

jest.mock('../../filters/cases.filter')

interface Then {
  result: Case[]
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('CaseController - Get all', () => {
  const user = { id: uuid() } as User
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseModel, caseController } = await createTestingCaseModule()

    mockCaseModel = caseModel

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await caseController.getAll(user)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('cases returned', () => {
    const filter = { something: uuid() }
    const cases = [{ id: uuid() }, { id: uuid() }]
    let then: Then

    beforeEach(async () => {
      const mockGetCasesQueryFilter = getCasesQueryFilter as jest.Mock
      mockGetCasesQueryFilter.mockReturnValueOnce(filter)
      const mockFindAll = mockCaseModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce(cases)

      then = await givenWhenThen()
    })

    it('should return cases', () => {
      expect(getCasesQueryFilter).toHaveBeenCalledWith(user)
      expect(mockCaseModel.findAll).toHaveBeenCalledWith({
        include: caseListInclude,
        where: filter,
      })
      expect(then.result).toBe(cases)
    })
  })
})

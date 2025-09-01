import { uuid } from 'uuidv4'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case } from '../../../repository'

interface Then {
  result: Case[]
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Promise<Then>

describe('CaseController - Get connected cases', () => {
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseModel, caseController } = await createTestingCaseModule()
    mockCaseModel = caseModel

    givenWhenThen = async (caseId: string, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await caseController.getConnectedCases(caseId, theCase)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case has no defendants', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should return an empty array', () => {
      expect(then.result).toEqual([])
    })
  })

  describe('case has defendants', () => {
    const caseId = uuid()
    const defendantId1 = uuid()
    const defendantId2 = uuid()
    const theCase = {
      id: caseId,
      defendants: [{ id: defendantId1 }, { id: defendantId2 }],
    } as Case
    const connectedCase1 = { id: uuid() } as Case
    const connectedCase2 = { id: uuid() } as Case
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockCaseModel.findAll as jest.Mock
      mockFindAll.mockResolvedValueOnce([connectedCase1, connectedCase2])
      then = await givenWhenThen(caseId, theCase)
    })

    it('should return the connected cases', () => {
      expect(then.result).toEqual([connectedCase1, connectedCase2])
    })
  })
})

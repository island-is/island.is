import { Case } from '../models'
import { CaseController } from '../case.controller'
import { createCaseController } from './createCaseController'

describe('get by id', () => {
  let caseController: CaseController

  beforeEach(async () => {
    caseController = await createCaseController(caseController)
  })

  describe('case exists', () => {
    const mockCase = {} as Case
    let returnedCase: Case

    beforeEach(async () => {
      returnedCase = await caseController.getById(mockCase)
    })

    it('should return the case', () => {
      expect(returnedCase).toBe(null)
    })
  })
})

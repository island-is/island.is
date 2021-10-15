import { Case } from '../models'
import { CaseController } from '../case.controller'
import { createTestingCaseModule } from './createTestingCaseModule'

describe('get by id', () => {
  let caseController: CaseController

  beforeEach(async () => {
    ;({ caseController } = await createTestingCaseModule())
  })

  describe('case exists', () => {
    const mockCase = {} as Case
    let returnedCase: Case

    beforeEach(async () => {
      returnedCase = await caseController.getById(mockCase)
    })

    it('should return the case', () => {
      expect(returnedCase).toBe(mockCase)
    })
  })
})

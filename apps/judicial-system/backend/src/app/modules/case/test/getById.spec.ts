import { Case } from '../models'
import { CaseController } from '../case.controller'
import { createTestingCaseModule } from './createTestingCaseModule'

describe('CaseController - Get by id', () => {
  let caseController: CaseController

  beforeEach(async () => {
    caseController = await createTestingCaseModule()
  })

  describe('case exists', () => {
    const theCase = {} as Case
    let result: Case

    beforeEach(async () => {
      result = await caseController.getById(theCase)
    })

    it('should return the case', () => {
      expect(result).toBe(theCase)
    })
  })
})

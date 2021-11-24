import { uuid } from 'uuidv4'

import { Case } from '../models'
import { CaseController } from '../case.controller'
import { createTestingCaseModule } from './createTestingCaseModule'

describe('CaseController - Get by id', () => {
  let caseController: CaseController

  beforeEach(async () => {
    caseController = await createTestingCaseModule()
  })

  describe('case exists', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    let result: Case

    beforeEach(async () => {
      result = await caseController.getById(caseId, theCase)
    })

    it('should return the case', () => {
      expect(result).toBe(theCase)
    })
  })
})

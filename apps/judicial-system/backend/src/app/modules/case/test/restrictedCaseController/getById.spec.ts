import { uuid } from 'uuidv4'

import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Then

describe('RestrictedCaseController - Get by id', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { restrictedCaseController } = await createTestingCaseModule()

    givenWhenThen = (caseId: string, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = restrictedCaseController.getById(caseId, theCase)
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
      then = givenWhenThen(caseId, theCase)
    })

    it('should return the case', () => {
      expect(then.result).toBe(theCase)
    })
  })
})

import { v4 as uuid } from 'uuid'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case } from '../../../repository'

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseId: string, theCase: Case) => Then

describe('CaseController - Get by id', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseController } = await createTestingCaseModule()

    givenWhenThen = (caseId: string, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = caseController.getById(caseId, theCase)
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

    beforeEach(() => {
      then = givenWhenThen(caseId, theCase)
    })

    it('should return the case', () => {
      expect(then.result).toBe(theCase)
    })
  })
})

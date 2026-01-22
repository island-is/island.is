import { v4 as uuid } from 'uuid'

import { SigningServiceResponse } from '@island.is/dokobit-signing'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case } from '../../../repository'

interface Then {
  result: SigningServiceResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  method?: 'audkenni' | 'mobile',
) => Promise<Then>

describe('CaseController - Request ruling signature', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseController } = await createTestingCaseModule()

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      method?: 'audkenni' | 'mobile',
    ) => {
      const then = {} as Then

      try {
        then.result = await caseController.requestRulingSignature(
          caseId,
          theCase,
          method,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('signature requested', () => {
    const userId = uuid()

    const caseId = uuid()
    const theCase = { id: caseId, judgeId: userId, judge: { id: userId, name: 'John Doe', nationalId: '0101301234', mobileNumber: '1234567890' } } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase)
    })

    it('should return a control code and a document token', () => {
      expect(then.result).toEqual({
        controlCode: '0000',
        documentToken: 'DEVELOPMENT',
      })
    })
  })
})

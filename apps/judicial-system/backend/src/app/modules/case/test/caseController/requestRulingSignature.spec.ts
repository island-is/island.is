import { uuid } from 'uuidv4'

import { SigningServiceResponse } from '@island.is/dokobit-signing'

import { User } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case } from '../../../repository'

interface Then {
  result: SigningServiceResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('CaseController - Request ruling signature', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseController } = await createTestingCaseModule()

    givenWhenThen = async (caseId: string, user: User, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = await caseController.requestRulingSignature(
          caseId,
          user,
          theCase,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('signature requested', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: userId } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should return a control code and a document token', () => {
      expect(then.result).toEqual({
        controlCode: '0000',
        documentToken: 'DEVELOPMENT',
      })
    })
  })
})

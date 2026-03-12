import { v4 as uuid } from 'uuid'

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
  method?: 'audkenni' | 'mobile',
) => Promise<Then>

describe('CaseController - Request court record signature', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseController } = await createTestingCaseModule()

    givenWhenThen = async (
      caseId: string,
      user: User,
      theCase: Case,
      method?: 'audkenni' | 'mobile',
    ) => {
      const then = {} as Then

      try {
        then.result = (await caseController.requestCourtRecordSignature(
          caseId,
          user,
          theCase,
          method,
        )) as SigningServiceResponse
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('request signature', () => {
    const user = {
      id: uuid(),
    } as User
    const caseId = uuid()
    const theCase = { id: caseId } as Case
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

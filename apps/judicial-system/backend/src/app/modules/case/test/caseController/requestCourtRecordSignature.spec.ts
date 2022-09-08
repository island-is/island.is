import { uuid } from 'uuidv4'
import { Response } from 'express'

import { ForbiddenException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { Case } from '../../models/case.model'
import { createTestingCaseModule } from '../createTestingCaseModule'

interface MockResponse extends Response {
  statusCode: number
  message: string
}

interface Then {
  result: MockResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  user: User,
  theCase: Case,
) => Promise<Then>

describe('CaseController - Request court record signature', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { caseController } = await createTestingCaseModule()

    givenWhenThen = async (caseId: string, user: User, theCase: Case) => {
      const then = {} as Then

      try {
        then.result = (await caseController.requestCourtRecordSignature(
          caseId,
          user,
          theCase,
        )) as MockResponse
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('the user is the assigned judge', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: userId, registrarId: uuid() } as Case
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

  describe('the user is the assigned registrar', () => {
    const userId = uuid()
    const user = { id: userId } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: uuid(), registrarId: userId } as Case
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

  describe('the user is not the assigned judge or registrar', () => {
    const user = { id: uuid() } as User
    const caseId = uuid()
    const theCase = { id: caseId, judgeId: uuid(), registrarId: uuid() } as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, user, theCase)
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        'A court record must be signed by the assigned judge or registrar',
      )
    })
  })
})

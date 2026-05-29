import { v4 as uuid } from 'uuid'

import { ExecutionContext, ForbiddenException } from '@nestjs/common'

import { UserRole } from '@island.is/judicial-system/types'

import { DefenderSubpoenaAccessGuard } from '../defenderSubpoenaAccess.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('Defender Subpoena Access Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new DefenderSubpoenaAccessGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defender is confirmed for the defendant', () => {
    const defendantId = uuid()
    const defenderNationalId = '1234567890'
    const theCase = {
      id: uuid(),
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId,
        },
      ],
    }
    let then: Then

    beforeEach(() => {
      mockRequest.mockReturnValueOnce({
        user: {
          currentUser: { role: UserRole.DEFENDER, nationalId: defenderNationalId },
        },
        case: theCase,
        defendant: { id: defendantId },
      })

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('defender is not confirmed for the defendant', () => {
    const defendantId = uuid()
    const theCase = {
      id: uuid(),
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId: '0987654321',
        },
      ],
    }
    let then: Then

    beforeEach(() => {
      mockRequest.mockReturnValueOnce({
        user: {
          currentUser: { role: UserRole.DEFENDER, nationalId: '1234567890' },
        },
        case: theCase,
        defendant: { id: defendantId },
      })

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(
        `Defender is not confirmed for defendant ${defendantId}`,
      )
    })
  })

  describe('non-defence user', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockReturnValueOnce({
        user: { currentUser: { role: UserRole.PROSECUTOR, nationalId: '1234567890' } },
        case: { id: uuid(), defendants: [] },
        defendant: { id: uuid() },
      })

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('missing user', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockReturnValueOnce({
        case: { id: uuid() },
        defendant: { id: uuid() },
      })

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })
})

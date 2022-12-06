import each from 'jest-each'

import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseState,
  prosecutionRoles,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../../../case'
import { ViewCaseFileGuard } from '../viewCaseFile.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Then

describe('View Case File Guard', () => {
  const mockRequest = jest.fn()
  let givenWhenThen: GivenWhenThen

  beforeEach(() => {
    givenWhenThen = (): Then => {
      const guard = new ViewCaseFileGuard()
      const then = {} as Then

      try {
        then.result = guard.canActivate(({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown) as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each(prosecutionRoles)('%s can view case files', (role) => {
    const user = { role } as User
    const theCase = {} as Case
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ user, case: theCase }))

      then = givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  each`
    role | state
    ${UserRole.REGISTRAR} | ${CaseState.SUBMITTED}
    ${UserRole.REGISTRAR} | ${CaseState.RECEIVED}
    ${UserRole.REGISTRAR} | ${CaseState.ACCEPTED}
    ${UserRole.REGISTRAR} | ${CaseState.REJECTED}
    ${UserRole.REGISTRAR} | ${CaseState.DISMISSED}
    ${UserRole.JUDGE} | ${CaseState.SUBMITTED}
    ${UserRole.JUDGE} | ${CaseState.RECEIVED}
    ${UserRole.JUDGE} | ${CaseState.ACCEPTED}
    ${UserRole.JUDGE} | ${CaseState.REJECTED}
    ${UserRole.JUDGE} | ${CaseState.DISMISSED}
  `.describe(
    'registrars and judges can view case files of completed cases',
    ({ role, state }) => {
      const user = { role } as User
      const theCase = { state } as Case
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({ user, case: theCase }))

        then = givenWhenThen()
      })

      it('should activate', () => {
        expect(then.result).toBe(true)
      })
    },
  )

  each`
    role | state
    ${UserRole.REGISTRAR} | ${CaseState.NEW}
    ${UserRole.REGISTRAR} | ${CaseState.DRAFT}
    ${UserRole.JUDGE} | ${CaseState.NEW}
    ${UserRole.JUDGE} | ${CaseState.DRAFT}
  `.describe(
    'registrars and judges can not view case files of unreceived cases',
    ({ role, state }) => {
      const user = { role } as User
      const theCase = { state } as Case
      let then: Then

      beforeEach(() => {
        mockRequest.mockImplementationOnce(() => ({ user, case: theCase }))

        then = givenWhenThen()
      })

      it('should throw ForbiddenException', () => {
        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(then.error.message).toBe(`Forbidden for ${role}`)
      })
    },
  )

  each`
    role
    ${UserRole.ADMIN}
    ${UserRole.STAFF}
  `.describe('other roles can not view case files', ({ role }) => {
    const user = { role } as User
    const theCase = {} as Case
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ user, case: theCase }))

      then = givenWhenThen()
    })

    it('should throw ForbiddenException', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toBe(`Forbidden for ${role}`)
    })
  })

  describe('missing user', () => {
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({}))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing user')
    })
  })

  describe('missing case', () => {
    const user = {} as User
    let then: Then

    beforeEach(() => {
      mockRequest.mockImplementationOnce(() => ({ user }))

      then = givenWhenThen()
    })

    it('should throw InternalServerErrorException', () => {
      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error.message).toBe('Missing case')
    })
  })
})

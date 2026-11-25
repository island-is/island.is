import { v4 as uuid } from 'uuid'

import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../../../repository'
import { MinimalCaseAccessGuard } from '../minimalCaseAccess.guard'
import { MinimalCaseWriteGuard } from '../minimalCaseWrite.guard'

interface Then {
  result?: boolean
  error?: Error
}

describe('Minimal Case Write Guard', () => {
  const prosecutorsOfficeId = uuid()
  const sharedWithProsecutorsOfficeId = uuid()
  const courtId = uuid()

  const theCase = {
    id: uuid(),
    type: CaseType.INDICTMENT,
    state: CaseState.DRAFT,
    prosecutorsOfficeId,
    sharedWithProsecutorsOfficeId,
    courtId,
  } as Case

  const prosecutorAt = (institutionId: string) =>
    ({
      id: uuid(),
      role: UserRole.PROSECUTOR,
      institution: {
        id: institutionId,
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
      },
    } as User)

  const judgeAt = (institutionId: string) =>
    ({
      id: uuid(),
      role: UserRole.DISTRICT_COURT_JUDGE,
      institution: { id: institutionId, type: InstitutionType.DISTRICT_COURT },
    } as User)

  const run =
    (guard: { canActivate: (c: ExecutionContext) => boolean }) =>
    (request: unknown): Then => {
      const then = {} as Then

      try {
        then.result = guard.canActivate({
          switchToHttp: () => ({ getRequest: () => request }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }

  const write = run(new MinimalCaseWriteGuard())
  const read = run(new MinimalCaseAccessGuard())

  describe("prosecutor at the case's own office", () => {
    const user = prosecutorAt(prosecutorsOfficeId)

    it('should activate', () => {
      expect(write({ user: { currentUser: user }, case: theCase })).toEqual({
        result: true,
      })
    })
  })

  // The point of the guard: sharing a case with another office gives its
  // prosecutors read access, and the access guard lets them through - but
  // not write access, as CaseWriteGuard already decides on the full-case
  // routes.
  describe('prosecutor at the office the case is shared with', () => {
    const user = prosecutorAt(sharedWithProsecutorsOfficeId)

    it('should throw ForbiddenException', () => {
      const then = write({ user: { currentUser: user }, case: theCase })

      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error?.message).toBe(
        `User ${user.id} does not have write access to minimal case ${theCase.id}`,
      )
    })

    it('should still pass the access guard', () => {
      expect(read({ user: { currentUser: user }, case: theCase })).toEqual({
        result: true,
      })
    })
  })

  describe('prosecutor at an unrelated office', () => {
    const user = prosecutorAt(uuid())

    it('should throw ForbiddenException', () => {
      const then = write({ user: { currentUser: user }, case: theCase })

      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  // District court access does not distinguish read from write, so the flag
  // changes nothing for the court.
  describe("judge at the case's court", () => {
    const user = judgeAt(courtId)
    const submittedCase = { ...theCase, state: CaseState.SUBMITTED } as Case

    it('should activate', () => {
      expect(
        write({ user: { currentUser: user }, case: submittedCase }),
      ).toEqual({ result: true })
    })

    it('should pass the access guard alike', () => {
      expect(
        read({ user: { currentUser: user }, case: submittedCase }),
      ).toEqual({ result: true })
    })
  })

  describe('judge at another court', () => {
    const user = judgeAt(uuid())
    const submittedCase = { ...theCase, state: CaseState.SUBMITTED } as Case

    it('should throw ForbiddenException', () => {
      const then = write({ user: { currentUser: user }, case: submittedCase })

      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('missing user', () => {
    it('should throw InternalServerErrorException', () => {
      const then = write({ user: undefined, case: theCase })

      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error?.message).toBe('Missing user')
    })
  })

  describe('missing case', () => {
    it('should throw InternalServerErrorException', () => {
      const then = write({
        user: { currentUser: prosecutorAt(prosecutorsOfficeId) },
        case: undefined,
      })

      expect(then.error).toBeInstanceOf(InternalServerErrorException)
      expect(then.error?.message).toBe('Missing case')
    })
  })
})

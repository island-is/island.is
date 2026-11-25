import {
  BadRequestException,
  ExecutionContext,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { AppealCase, AppealCourtSession } from '../../../repository'
import { AppealCourtSessionExistsGuard } from '../appealCourtSessionExists.guard'

describe('AppealCourtSessionExistsGuard', () => {
  const guard = new AppealCourtSessionExistsGuard()

  const buildContext = (request: unknown) =>
    ({
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext)

  const session = { id: 'session_id' } as AppealCourtSession
  const appealCase = {
    id: 'appeal_case_id',
    courtSessions: [session],
  } as AppealCase

  it('should resolve the session on the appeal case', () => {
    const request = {
      appealCase,
      params: { appealCourtSessionId: session.id },
    }

    expect(guard.canActivate(buildContext(request))).toBe(true)
    expect(request).toHaveProperty('appealCourtSession', session)
  })

  it('should throw when the session is not on the appeal case', () => {
    expect(() =>
      guard.canActivate(
        buildContext({
          appealCase,
          params: { appealCourtSessionId: 'other_id' },
        }),
      ),
    ).toThrow(NotFoundException)
  })

  it('should throw when the appeal case has no sessions', () => {
    expect(() =>
      guard.canActivate(
        buildContext({
          appealCase: { id: appealCase.id } as AppealCase,
          params: { appealCourtSessionId: session.id },
        }),
      ),
    ).toThrow(NotFoundException)
  })

  it('should throw when no session id is given', () => {
    expect(() =>
      guard.canActivate(buildContext({ appealCase, params: {} })),
    ).toThrow(BadRequestException)
  })

  it('should throw when the appeal case is missing', () => {
    expect(() =>
      guard.canActivate(
        buildContext({ params: { appealCourtSessionId: session.id } }),
      ),
    ).toThrow(InternalServerErrorException)
  })
})

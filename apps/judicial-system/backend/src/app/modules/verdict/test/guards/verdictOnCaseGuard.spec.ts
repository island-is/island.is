import {
  ExecutionContext,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { VerdictServiceStatus } from '@island.is/judicial-system/types'

import { VerdictOnCaseGuard } from '../../guards/verdictOnCase.guard'

describe('VerdictOnCaseGuard', () => {
  const guard = new VerdictOnCaseGuard()

  const createContext = (request: { case?: unknown; verdict?: unknown }) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext)

  // The verdict on the request was read before the case was locked, so its
  // fields may be stale; the copy on the locked case is the one to trust.
  it('replaces request.verdict with the copy of it on the case', () => {
    const request = {
      case: {
        id: 'case',
        defendants: [
          { id: 'other', verdicts: [{ id: 'theirs' }] },
          {
            id: 'defendant',
            verdicts: [
              { id: 'superseded' },
              {
                id: 'verdict',
                serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
              },
            ],
          },
        ],
      },
      verdict: { id: 'verdict', serviceStatus: undefined },
    }

    expect(guard.canActivate(createContext(request))).toBe(true)
    expect(request.verdict).toBe(request.case.defendants[1].verdicts[1])
  })

  it('throws when the verdict is not on the case', () => {
    const request = {
      case: {
        id: 'case',
        defendants: [{ id: 'defendant', verdicts: [{ id: 'another' }] }],
      },
      verdict: { id: 'verdict' },
    }

    expect(() => guard.canActivate(createContext(request))).toThrow(
      NotFoundException,
    )
  })

  it('throws when the case has no defendants', () => {
    const request = {
      case: { id: 'case' },
      verdict: { id: 'verdict' },
    }

    expect(() => guard.canActivate(createContext(request))).toThrow(
      NotFoundException,
    )
  })

  // Both are guard-order mistakes rather than requests the caller can fix.
  it('throws when the case is missing', () => {
    expect(() =>
      guard.canActivate(createContext({ verdict: { id: 'verdict' } })),
    ).toThrow(InternalServerErrorException)
  })

  it('throws when the verdict is missing', () => {
    expect(() =>
      guard.canActivate(createContext({ case: { id: 'case' } })),
    ).toThrow(InternalServerErrorException)
  })
})

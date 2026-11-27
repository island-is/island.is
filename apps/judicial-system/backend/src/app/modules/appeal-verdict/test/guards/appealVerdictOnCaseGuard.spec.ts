import {
  ExecutionContext,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { VerdictServiceStatus } from '@island.is/judicial-system/types'

import { AppealVerdictOnCaseGuard } from '../../guards/appealVerdictOnCase.guard'

describe('AppealVerdictOnCaseGuard', () => {
  const guard = new AppealVerdictOnCaseGuard()

  const createContext = (request: {
    case?: unknown
    appealVerdict?: unknown
  }) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext)

  // The appeal verdict on the request was read before the case was locked, so
  // its fields may be stale; the copy on the locked case is the one to trust.
  it('replaces request.appealVerdict with the copy of it on the case', () => {
    const request = {
      case: {
        id: 'case',
        defendants: [
          { id: 'other', appealVerdicts: [{ id: 'theirs' }] },
          {
            id: 'defendant',
            appealVerdicts: [
              { id: 'superseded' },
              {
                id: 'appeal-verdict',
                serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
              },
            ],
          },
        ],
      },
      appealVerdict: { id: 'appeal-verdict', serviceStatus: undefined },
    }

    expect(guard.canActivate(createContext(request))).toBe(true)
    expect(request.appealVerdict).toBe(
      request.case.defendants[1].appealVerdicts[1],
    )
  })

  it('throws when the appeal verdict is not on the case', () => {
    const request = {
      case: {
        id: 'case',
        defendants: [{ id: 'defendant', appealVerdicts: [{ id: 'another' }] }],
      },
      appealVerdict: { id: 'appeal-verdict' },
    }

    expect(() => guard.canActivate(createContext(request))).toThrow(
      NotFoundException,
    )
  })

  it('throws when the case has no defendants', () => {
    const request = {
      case: { id: 'case' },
      appealVerdict: { id: 'appeal-verdict' },
    }

    expect(() => guard.canActivate(createContext(request))).toThrow(
      NotFoundException,
    )
  })

  // Both are guard-order mistakes rather than requests the caller can fix.
  it('throws when the case is missing', () => {
    expect(() =>
      guard.canActivate(
        createContext({ appealVerdict: { id: 'appeal-verdict' } }),
      ),
    ).toThrow(InternalServerErrorException)
  })

  it('throws when the appeal verdict is missing', () => {
    expect(() =>
      guard.canActivate(createContext({ case: { id: 'case' } })),
    ).toThrow(InternalServerErrorException)
  })
})

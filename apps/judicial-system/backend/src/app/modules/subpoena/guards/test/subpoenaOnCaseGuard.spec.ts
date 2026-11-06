import {
  ExecutionContext,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { ServiceStatus } from '@island.is/judicial-system/types'

import { SubpoenaOnCaseGuard } from '../subpoenaOnCase.guard'

describe('SubpoenaOnCaseGuard', () => {
  const guard = new SubpoenaOnCaseGuard()

  const createContext = (request: {
    case?: unknown
    subpoena?: unknown
    defendant?: unknown
  }) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext)

  // The subpoena on the request was read before the case was locked, so its
  // fields may be stale; the copy on the locked case is the one to trust, and
  // so is the defendant it is found under.
  it('replaces request.subpoena and request.defendant with the copies on the case', () => {
    const request = {
      case: {
        id: 'case',
        defendants: [
          { id: 'other', subpoenas: [{ id: 'theirs' }] },
          {
            id: 'defendant',
            subpoenas: [
              { id: 'superseded' },
              { id: 'subpoena', serviceStatus: ServiceStatus.ELECTRONICALLY },
            ],
          },
        ],
      },
      subpoena: { id: 'subpoena', serviceStatus: undefined },
      defendant: undefined,
    }

    expect(guard.canActivate(createContext(request))).toBe(true)
    expect(request.subpoena).toBe(request.case.defendants[1].subpoenas[1])
    expect(request.defendant).toBe(request.case.defendants[1])
  })

  // A subpoena stays with the case it was issued in when its defendant later
  // leaves with a split case, and the locked case carries those subpoenas
  // under the split case's defendants.
  it('finds a subpoena issued before a split under the split case', () => {
    const request = {
      case: {
        id: 'case',
        defendants: [{ id: 'remaining', subpoenas: [{ id: 'theirs' }] }],
        splitCases: [
          {
            id: 'split',
            defendants: [
              {
                id: 'departed',
                subpoenas: [
                  { id: 'subpoena', serviceStatus: ServiceStatus.IN_PERSON },
                ],
              },
            ],
          },
        ],
      },
      subpoena: { id: 'subpoena', serviceStatus: undefined },
      defendant: undefined,
    }

    expect(guard.canActivate(createContext(request))).toBe(true)
    expect(request.subpoena).toBe(
      request.case.splitCases[0].defendants[0].subpoenas[0],
    )
    expect(request.defendant).toBe(request.case.splitCases[0].defendants[0])
  })

  it('throws when the subpoena is not on the case', () => {
    const request = {
      case: {
        id: 'case',
        defendants: [{ id: 'defendant', subpoenas: [{ id: 'another' }] }],
      },
      subpoena: { id: 'subpoena' },
    }

    expect(() => guard.canActivate(createContext(request))).toThrow(
      NotFoundException,
    )
  })

  it('throws when the case has no defendants', () => {
    const request = {
      case: { id: 'case' },
      subpoena: { id: 'subpoena' },
    }

    expect(() => guard.canActivate(createContext(request))).toThrow(
      NotFoundException,
    )
  })

  // Both are guard-order mistakes rather than requests the caller can fix.
  it('throws when the case is missing', () => {
    expect(() =>
      guard.canActivate(createContext({ subpoena: { id: 'subpoena' } })),
    ).toThrow(InternalServerErrorException)
  })

  it('throws when the subpoena is missing', () => {
    expect(() =>
      guard.canActivate(createContext({ case: { id: 'case' } })),
    ).toThrow(InternalServerErrorException)
  })
})

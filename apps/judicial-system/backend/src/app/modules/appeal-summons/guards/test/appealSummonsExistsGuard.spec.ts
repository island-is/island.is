import {
  BadRequestException,
  ExecutionContext,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { AppealSummons, Case } from '../../repository'
import { AppealSummonsExistsGuard } from '../appealSummonsExists.guard'

describe('AppealSummonsExistsGuard', () => {
  const guard = new AppealSummonsExistsGuard()

  const buildContext = (request: unknown) =>
    ({
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext)

  const summons = { id: 'summons_id' } as AppealSummons
  const theCase = {
    id: 'case_id',
    verdictAppealCase: { appealSummonses: [summons] },
  } as Case

  it('should resolve the summons on the verdict appeal case', () => {
    const request = {
      case: theCase,
      params: { appealSummonsId: summons.id },
    }

    expect(guard.canActivate(buildContext(request))).toBe(true)
    expect(request).toHaveProperty('appealSummons', summons)
  })

  it('should throw when the summons is not on the case', () => {
    expect(() =>
      guard.canActivate(
        buildContext({
          case: theCase,
          params: { appealSummonsId: 'other_id' },
        }),
      ),
    ).toThrow(NotFoundException)
  })

  it('should throw when no summons id is given', () => {
    expect(() =>
      guard.canActivate(buildContext({ case: theCase, params: {} })),
    ).toThrow(BadRequestException)
  })

  it('should throw when the case is missing', () => {
    expect(() => guard.canActivate(buildContext({ params: {} }))).toThrow(
      InternalServerErrorException,
    )
  })
})

import { ExecutionContext } from '@nestjs/common'
import { BadRequestException, NotFoundException } from '@nestjs/common'

import { AppealCaseType } from '@island.is/judicial-system/types'

import { AppealCase, Case } from '../../repository'
import { AppealCaseExistsGuard } from '../guards/appealCaseExists.guard'

describe('AppealCaseExistsGuard', () => {
  const guard = new AppealCaseExistsGuard()

  const buildContext = (request: unknown) =>
    ({
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext)

  const caseLevelAppeal = {
    id: 'case_level_appeal_id',
    appealType: AppealCaseType.RULING,
  } as AppealCase

  const verdictAppeal = {
    id: 'verdict_appeal_id',
    appealType: AppealCaseType.VERDICT,
  } as AppealCase

  const rulingOrderAppeal = {
    id: 'ruling_order_appeal_id',
    appealType: AppealCaseType.RULING,
    rulingFileId: 'ruling_file_id',
  } as AppealCase

  const theCase = {
    id: 'case_id',
    appealCase: caseLevelAppeal,
    verdictAppealCase: verdictAppeal,
    rulingOrderAppealCases: [rulingOrderAppeal],
  } as Case

  it('should resolve the case level ruling appeal', () => {
    const request = {
      case: theCase,
      params: { appealCaseId: caseLevelAppeal.id },
    }

    expect(guard.canActivate(buildContext(request))).toBe(true)
    expect(request).toHaveProperty('appealCase', caseLevelAppeal)
  })

  // The verdict appeal is case level too, so it is in neither of the associations the
  // guard used to look at.
  it('should resolve the verdict appeal', () => {
    const request = {
      case: theCase,
      params: { appealCaseId: verdictAppeal.id },
    }

    expect(guard.canActivate(buildContext(request))).toBe(true)
    expect(request).toHaveProperty('appealCase', verdictAppeal)
  })

  it('should resolve a ruling order appeal', () => {
    const request = {
      case: theCase,
      params: { appealCaseId: rulingOrderAppeal.id },
    }

    expect(guard.canActivate(buildContext(request))).toBe(true)
    expect(request).toHaveProperty('appealCase', rulingOrderAppeal)
  })

  it('should throw when the appeal case is not on the case', () => {
    expect(() =>
      guard.canActivate(
        buildContext({ case: theCase, params: { appealCaseId: 'other_id' } }),
      ),
    ).toThrow(NotFoundException)
  })

  it('should throw when no appeal case id is given', () => {
    expect(() =>
      guard.canActivate(buildContext({ case: theCase, params: {} })),
    ).toThrow(BadRequestException)
  })
})

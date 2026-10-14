import tracer from 'dd-trace'
import type { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ExecutionContext } from '@nestjs/common'

import { createTestingCaseModule } from '../../test/createTestingCaseModule'

import { runInRequestContext } from '../../../../test'
import { CaseExistsGuard } from '../caseExists.guard'
import { CaseExistsForUpdateGuard } from '../caseExistsForUpdate.guard'
import { IndictmentCaseExistsForDefendantGuard } from '../indictmentCaseExistsForDefendant.guard'
import { LimitedAccessCaseExistsGuard } from '../limitedAccessCaseExists.guard'
import { MinimalCaseExistsGuard } from '../minimalCaseExists.guard'
import {
  CASE_LOAD_GUARD_TAG,
  CASE_LOAD_INCLUDE_TAG,
  CASE_LOAD_ROUTE_TAG,
  CASE_LOAD_SPAN,
} from '../traceCaseLoad'

jest.mock('dd-trace')

// Every guard that loads a case does so through traceCaseLoad, under its own
// name and include profile. A guard added without it would load untraced and
// be missing from the per-guard breakdown, so this pins each one.
describe('case load tracing', () => {
  const caseId = uuid()
  const theCase = { id: caseId }
  const mockTrace = tracer.trace as jest.Mock
  const route = { method: 'GET', route: { path: '/api/case/:caseId' } }

  const activate = (
    guard: { canActivate: (context: ExecutionContext) => Promise<boolean> },
    request: Record<string, unknown>,
  ) =>
    runInRequestContext(() =>
      guard.canActivate({
        switchToHttp: () => ({ getRequest: () => ({ ...route, ...request }) }),
      } as unknown as ExecutionContext),
    )

  beforeEach(() => {
    mockTrace.mockImplementation((_name, _options, fn) => fn())
  })

  const expectTraced = (guard: string, include: string) => {
    expect(mockTrace).toHaveBeenCalledWith(
      CASE_LOAD_SPAN,
      {
        resource: guard,
        tags: {
          [CASE_LOAD_GUARD_TAG]: guard,
          [CASE_LOAD_INCLUDE_TAG]: include,
          [CASE_LOAD_ROUTE_TAG]: 'GET /api/case/:caseId',
        },
      },
      expect.any(Function),
    )
  }

  it('CaseExistsGuard loads the full case', async () => {
    const { caseService } = await createTestingCaseModule()
    jest.spyOn(caseService, 'findById').mockResolvedValue(theCase as never)

    await activate(new CaseExistsGuard(caseService), { params: { caseId } })

    expectTraced('CaseExistsGuard', 'case')
  })

  it('CaseExistsForUpdateGuard loads the full case', async () => {
    const { caseService, sequelize } = await createTestingCaseModule()
    ;(sequelize.transaction as jest.Mock).mockResolvedValue({} as Transaction)
    jest
      .spyOn(caseService, 'findByIdForUpdate')
      .mockResolvedValue(theCase as never)

    await activate(new CaseExistsForUpdateGuard(caseService, sequelize), {
      params: { caseId },
    })

    expectTraced('CaseExistsForUpdateGuard', 'case')
  })

  it('MinimalCaseExistsGuard loads the minimal case', async () => {
    const { caseService } = await createTestingCaseModule()
    jest
      .spyOn(caseService, 'findMinimalById')
      .mockResolvedValue(theCase as never)

    await activate(new MinimalCaseExistsGuard(caseService), {
      params: { caseId },
    })

    expectTraced('MinimalCaseExistsGuard', 'minimal')
  })

  it('LimitedAccessCaseExistsGuard loads the limited access case', async () => {
    const { limitedAccessCaseService } = await createTestingCaseModule()
    jest
      .spyOn(limitedAccessCaseService, 'findById')
      .mockResolvedValue(theCase as never)

    await activate(new LimitedAccessCaseExistsGuard(limitedAccessCaseService), {
      params: { caseId },
      user: { currentUser: { id: uuid() } },
    })

    expectTraced('LimitedAccessCaseExistsGuard', 'limitedAccess')
  })

  it('IndictmentCaseExistsForDefendantGuard loads the indictment for one defendant', async () => {
    const { internalCaseService } = await createTestingCaseModule()
    jest
      .spyOn(internalCaseService, 'findByIdAndDefendantNationalId')
      .mockResolvedValue(theCase as never)

    await activate(
      new IndictmentCaseExistsForDefendantGuard(internalCaseService),
      { params: { caseId, defendantNationalId: '0000000000' } },
    )

    expectTraced('IndictmentCaseExistsForDefendantGuard', 'defendantIndictment')
  })
})

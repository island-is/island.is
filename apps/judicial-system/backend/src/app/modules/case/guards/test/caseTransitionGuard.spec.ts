import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseIndictmentRulingDecision,
  CaseTransition,
  CaseType,
} from '@island.is/judicial-system/types'

import { CaseTransitionGuard } from '../caseTransition.guard'

describe('CaseTransitionGuard', () => {
  let guard: CaseTransitionGuard
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockRequest: jest.Mock

  beforeEach(() => {
    guard = new CaseTransitionGuard()
    mockRequest = jest.fn()
  })

  const mockExecutionContext = (requestMock: unknown): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => requestMock,
      }),
    } as unknown as ExecutionContext)

  const createMockCase = (
    type: CaseType,
    rulingDecision: unknown,
    judgeId: string,
  ) => ({
    type,
    indictmentRulingDecision: rulingDecision,
    judgeId,
  })

  it('should activate when the judge is the assigned judge', () => {
    const mockCase = createMockCase(
      CaseType.INDICTMENT,
      CaseIndictmentRulingDecision.RULING,
      'judgeId',
    )
    const context = mockExecutionContext({
      body: { transition: CaseTransition.COMPLETE },
      case: mockCase,
      user: { currentUser: { id: 'judgeId' } },
    })

    const result = guard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should not activate when the user is not the assigned judge', () => {
    const mockCase = createMockCase(
      CaseType.INDICTMENT,
      CaseIndictmentRulingDecision.RULING,
      'judgeId',
    )
    const context = mockExecutionContext({
      body: { transition: CaseTransition.COMPLETE },
      case: mockCase,
      user: { currentUser: { id: 'differentJudgeId' } },
    })

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException)
  })

  it('should activate using the default rule for transitions not in the rule map', () => {
    const mockCase = createMockCase(CaseType.CUSTODY, null, 'someId')
    const context = mockExecutionContext({
      body: { transition: CaseTransition.SUBMIT },
      case: mockCase,
      user: { currentUser: { id: 'someId' } },
    })

    const result = guard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should throw InternalServerErrorException when case or user is missing', () => {
    const context = mockExecutionContext({
      body: { transition: CaseTransition.COMPLETE },
      case: null,
      user: { currentUser: null },
    })

    expect(() => guard.canActivate(context)).toThrow(
      InternalServerErrorException,
    )
  })
})

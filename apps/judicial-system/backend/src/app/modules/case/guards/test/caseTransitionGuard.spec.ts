import {
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  CaseIndictmentRulingDecision,
  CaseTransition,
  CaseType,
  IndictmentDecision,
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
    indictmentDecision?: unknown,
  ) => ({
    type,
    indictmentRulingDecision: rulingDecision,
    indictmentDecision,
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

  it('should activate when the completing decisions match the persisted case', () => {
    const mockCase = createMockCase(
      CaseType.INDICTMENT,
      CaseIndictmentRulingDecision.FINE,
      'judgeId',
      IndictmentDecision.COMPLETING,
    )
    const context = mockExecutionContext({
      body: {
        transition: CaseTransition.COMPLETE,
        indictmentDecision: IndictmentDecision.COMPLETING,
        indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      },
      case: mockCase,
      user: { currentUser: { id: 'judgeId' } },
    })

    const result = guard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should throw ConflictException when the indictment decision has changed', () => {
    const mockCase = createMockCase(
      CaseType.INDICTMENT,
      CaseIndictmentRulingDecision.FINE,
      'judgeId',
      IndictmentDecision.COMPLETING,
    )
    const context = mockExecutionContext({
      body: {
        transition: CaseTransition.COMPLETE,
        indictmentDecision: IndictmentDecision.POSTPONING,
        indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      },
      case: mockCase,
      user: { currentUser: { id: 'judgeId' } },
    })

    expect(() => guard.canActivate(context)).toThrow(ConflictException)
  })

  it('should throw ConflictException when the indictment ruling decision has changed', () => {
    const mockCase = createMockCase(
      CaseType.INDICTMENT,
      CaseIndictmentRulingDecision.FINE,
      'judgeId',
      IndictmentDecision.COMPLETING,
    )
    const context = mockExecutionContext({
      body: {
        transition: CaseTransition.COMPLETE,
        indictmentDecision: IndictmentDecision.COMPLETING,
        indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      },
      case: mockCase,
      user: { currentUser: { id: 'judgeId' } },
    })

    expect(() => guard.canActivate(context)).toThrow(ConflictException)
  })

  it('should activate when completing decisions are omitted from the body', () => {
    const mockCase = createMockCase(
      CaseType.INDICTMENT,
      CaseIndictmentRulingDecision.FINE,
      'judgeId',
      IndictmentDecision.COMPLETING,
    )
    const context = mockExecutionContext({
      body: { transition: CaseTransition.COMPLETE },
      case: mockCase,
      user: { currentUser: { id: 'judgeId' } },
    })

    const result = guard.canActivate(context)

    expect(result).toBe(true)
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

import {
  AppealCase,
  Case,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { resolveTargetAppealCaseByAppealCaseId } from './index'

const appeal = (id: string): AppealCase => ({ id } as AppealCase)

describe('resolveTargetAppealCaseByAppealCaseId', () => {
  const caseLevel = appeal('case-level-appeal')
  const ro1 = appeal('ruling-order-1')
  const ro2 = appeal('ruling-order-2')

  const workingCase = {
    appealCase: caseLevel,
    rulingOrderAppealCases: [ro1, ro2],
  } as Case

  it('returns the case-level appeal when no query param is set', () => {
    expect(
      resolveTargetAppealCaseByAppealCaseId(workingCase, undefined),
    ).toBe(caseLevel)
  })

  it('returns the case-level appeal when the query id matches it', () => {
    expect(
      resolveTargetAppealCaseByAppealCaseId(workingCase, 'case-level-appeal'),
    ).toBe(caseLevel)
  })

  it('returns the matching ruling-order appeal when the query id matches', () => {
    expect(
      resolveTargetAppealCaseByAppealCaseId(workingCase, 'ruling-order-2'),
    ).toBe(ro2)
  })

  it('returns undefined when the query id matches nothing', () => {
    expect(
      resolveTargetAppealCaseByAppealCaseId(workingCase, 'unknown-id'),
    ).toBeUndefined()
  })

  it('returns the case-level appeal when rulingOrderAppealCases is missing', () => {
    const onlyCaseLevel = { appealCase: caseLevel } as Case

    expect(
      resolveTargetAppealCaseByAppealCaseId(onlyCaseLevel, undefined),
    ).toBe(caseLevel)
  })

  it('returns undefined when there are no appeals at all', () => {
    const noAppeals = {} as Case

    expect(
      resolveTargetAppealCaseByAppealCaseId(noAppeals, undefined),
    ).toBeUndefined()
    expect(
      resolveTargetAppealCaseByAppealCaseId(noAppeals, 'anything'),
    ).toBeUndefined()
  })
})

import {
  AppealCase,
  Case,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { resolveTargetAppealCaseByRulingFileId } from './index'

const appeal = (id: string, rulingFileId?: string): AppealCase =>
  ({ id, rulingFileId } as AppealCase)

describe('resolveTargetAppealCaseByRulingFileId', () => {
  const caseLevel = appeal('case-level-appeal')
  const ro1 = appeal('ruling-order-1', 'rf-1')
  const ro2 = appeal('ruling-order-2', 'rf-2')

  const workingCase = {
    appealCase: caseLevel,
    rulingOrderAppealCases: [ro1, ro2],
  } as Case

  it('returns the case-level appeal when no rulingFileId is set', () => {
    expect(resolveTargetAppealCaseByRulingFileId(workingCase, undefined)).toBe(
      caseLevel,
    )
  })

  it('returns the ruling-order appeal whose rulingFileId matches', () => {
    expect(resolveTargetAppealCaseByRulingFileId(workingCase, 'rf-2')).toBe(ro2)
  })

  it('returns undefined when no ruling-order appeal targets that file', () => {
    expect(
      resolveTargetAppealCaseByRulingFileId(workingCase, 'rf-unknown'),
    ).toBeUndefined()
  })

  it('does not match the case-level appeal even when supplied an id (case-level has null rulingFileId)', () => {
    expect(
      resolveTargetAppealCaseByRulingFileId(workingCase, 'case-level-appeal'),
    ).toBeUndefined()
  })
})

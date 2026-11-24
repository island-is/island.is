import type { RolesRule } from '@island.is/judicial-system/auth'

import {
  courtOfAppealsAssistantUpdateRule,
  courtOfAppealsJudgeUpdateRule,
  courtOfAppealsRegistrarUpdateRule,
  prosecutorRepresentativeUpdateRule,
  prosecutorUpdateRule,
} from '../../guards/rolesRules'

// RolesGuard rejects an update naming a field the user's rule does not list,
// so the lists are what decides who may record the verdict appeal status.
describe('AppealCaseController - Update rules', () => {
  const dtoFields = (rule: RolesRule) =>
    (rule as { dtoFields?: string[] }).dtoFields ?? []

  it.each([
    ['judge', courtOfAppealsJudgeUpdateRule],
    ['registrar', courtOfAppealsRegistrarUpdateRule],
    ['assistant', courtOfAppealsAssistantUpdateRule],
  ])(
    'should let a court of appeals %s record the verdict appeal status',
    (_, rule) => {
      expect(dtoFields(rule)).toContain('verdictAppealStatus')
    },
  )

  it.each([
    ['prosecutor', prosecutorUpdateRule],
    ['prosecutor representative', prosecutorRepresentativeUpdateRule],
  ])('should not let a %s record the verdict appeal status', (_, rule) => {
    expect(dtoFields(rule)).not.toContain('verdictAppealStatus')
  })

  it.each([
    ['judge', courtOfAppealsJudgeUpdateRule],
    ['registrar', courtOfAppealsRegistrarUpdateRule],
    ['assistant', courtOfAppealsAssistantUpdateRule],
  ])(
    'should let a court of appeals %s record the date a verdict appeal ended',
    (_, rule) => {
      expect(dtoFields(rule)).toContain('appealRulingDate')
    },
  )

  it.each([
    ['prosecutor', prosecutorUpdateRule],
    ['prosecutor representative', prosecutorRepresentativeUpdateRule],
  ])('should not let a %s record the date an appeal ended', (_, rule) => {
    expect(dtoFields(rule)).not.toContain('appealRulingDate')
  })
})

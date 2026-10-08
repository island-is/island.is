import type { RolesRule } from '@island.is/judicial-system/auth'
import { RulesType } from '@island.is/judicial-system/auth'
import { UserRole } from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantUpdateCivilClaimantRule,
  courtOfAppealsAssistantUpdateDefendantRule,
  courtOfAppealsJudgeUpdateCivilClaimantRule,
  courtOfAppealsJudgeUpdateDefendantRule,
  courtOfAppealsRegistrarUpdateCivilClaimantRule,
  courtOfAppealsRegistrarUpdateDefendantRule,
} from '../guards/rolesRules'

/**
 * What the court of appeals may write on a defendant and a civil claimant.
 *
 * That these rules reach the update routes at all is asserted by the two
 * updateRolesRules specs, which pin the whole list per route. What they cannot
 * say is how far each rule reaches, and that is the point of the arrangement:
 * who defended at the district court is a fact about that proceeding, and this
 * court writes beside it rather than over it. A role rule here would hand over
 * every field on the record.
 */
describe('court of appeals appeal advocate rules', () => {
  // RolesRule is a union - a bare UserRole grants the whole route. Narrowing
  // to the field shape is itself the assertion that this is not one of those.
  const fieldRule = (rule: RolesRule) => {
    if (typeof rule === 'string' || rule.type !== RulesType.FIELD) {
      throw new Error(`Expected a field rule, got ${JSON.stringify(rule)}`)
    }

    return rule
  }

  describe('on a defendant', () => {
    it.each([
      courtOfAppealsJudgeUpdateDefendantRule,
      courtOfAppealsRegistrarUpdateDefendantRule,
      courtOfAppealsAssistantUpdateDefendantRule,
    ])('limits $role to the appeal proceeding', (rule) => {
      expect(fieldRule(rule).dtoFields).toEqual([
        'appealDefenderNationalId',
        'appealDefenderName',
        'appealDefenderEmail',
        'appealDefenderPhoneNumber',
        'isAppealDefenderWaived',
        'isAppealDefenderConfirmed',
      ])
    })

    it('leaves the district court fields out of reach', () => {
      const districtCourtFields = [
        'defenderNationalId',
        'defenderName',
        'defenderEmail',
        'defenderPhoneNumber',
        'defenderChoice',
        'isDefenderChoiceConfirmed',
        'caseFilesSharedWithDefender',
      ]

      for (const field of districtCourtFields) {
        expect(
          fieldRule(courtOfAppealsJudgeUpdateDefendantRule).dtoFields,
        ).not.toContain(field)
      }
    })
  })

  describe('on a civil claimant', () => {
    it.each([
      courtOfAppealsJudgeUpdateCivilClaimantRule,
      courtOfAppealsRegistrarUpdateCivilClaimantRule,
      courtOfAppealsAssistantUpdateCivilClaimantRule,
    ])('limits $role to the appeal proceeding', (rule) => {
      expect(fieldRule(rule).dtoFields).toEqual([
        'hasAppealSpokesperson',
        'appealSpokespersonIsLawyer',
        'appealSpokespersonNationalId',
        'appealSpokespersonName',
        'appealSpokespersonEmail',
        'appealSpokespersonPhoneNumber',
        'isAppealSpokespersonConfirmed',
      ])
    })

    it('leaves the district court fields out of reach', () => {
      const districtCourtFields = [
        'hasSpokesperson',
        'spokespersonIsLawyer',
        'spokespersonNationalId',
        'spokespersonName',
        'spokespersonEmail',
        'spokespersonPhoneNumber',
        'isSpokespersonConfirmed',
        'caseFilesSharedWithSpokesperson',
      ]

      for (const field of districtCourtFields) {
        expect(
          fieldRule(courtOfAppealsJudgeUpdateCivilClaimantRule).dtoFields,
        ).not.toContain(field)
      }
    })
  })

  it('covers every court of appeals role', () => {
    expect(
      [
        courtOfAppealsJudgeUpdateDefendantRule,
        courtOfAppealsRegistrarUpdateDefendantRule,
        courtOfAppealsAssistantUpdateDefendantRule,
      ].map((rule) => fieldRule(rule).role),
    ).toEqual([
      UserRole.COURT_OF_APPEALS_JUDGE,
      UserRole.COURT_OF_APPEALS_REGISTRAR,
      UserRole.COURT_OF_APPEALS_ASSISTANT,
    ])
  })
})

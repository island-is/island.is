import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import type { RolesRule } from '@island.is/judicial-system/auth'
import { RolesGuard } from '@island.is/judicial-system/auth'
import { courtOfAppealsRoles, UserRole } from '@island.is/judicial-system/types'

import { AppealCaseController } from '../../appealCase.controller'
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

  // Runs the route's own rules through the guard for every role, so a role
  // given a rule on the route is held to the same answer as the ones above.
  describe('through the update route', () => {
    const update: unknown = Reflect.get(
      AppealCaseController.prototype,
      'update',
    )

    const canUpdate = (role: UserRole, body: Record<string, unknown>) => {
      if (typeof update !== 'function') {
        throw new Error('No update handler')
      }

      return new RolesGuard(new Reflector()).canActivate({
        getHandler: () => update,
        switchToHttp: () => ({
          getRequest: () => ({
            user: { currentUser: { role } },
            body,
          }),
        }),
      } as unknown as ExecutionContext)
    }

    const otherRoles = Object.values(UserRole).filter(
      (role) => !courtOfAppealsRoles.includes(role),
    )

    // The refusals below are about the fields, not about the role being shut
    // out of the route.
    it('should let a prosecutor update what a prosecutor may', () => {
      expect(
        canUpdate(UserRole.PROSECUTOR, {
          requestAppealRulingNotToBePublished: true,
        }),
      ).toBe(true)
    })

    it.each(courtOfAppealsRoles)(
      'should let a %s record the date a verdict appeal ended',
      (role) => {
        expect(canUpdate(role, { appealRulingDate: '2026-11-20' })).toBe(true)
      },
    )

    it.each(otherRoles)(
      'should not let a %s record the date a verdict appeal ended',
      (role) => {
        expect(canUpdate(role, { appealRulingDate: '2026-11-20' })).toBe(false)
      },
    )

    it.each(otherRoles)(
      'should not let a %s record the verdict appeal status',
      (role) => {
        expect(canUpdate(role, { verdictAppealStatus: 'COMPLETED' })).toBe(
          false,
        )
      },
    )
  })
})

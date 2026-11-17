import { verifyRolesRules } from '../../../../test'
import { FileController } from '../../file.controller'
import { districtCourtJudgeConfirmRulingOrderRule } from '../../guards/rolesRules'

describe('FileController - Confirm ruling order rules', () => {
  verifyRolesRules(FileController, 'confirmRulingOrder', [
    districtCourtJudgeConfirmRulingOrderRule,
  ])

  // The rule reads the case to check that the user is its registered judge,
  // which is why this route alone keeps RolesGuard behind the locking read
  // and puts RouteRolesGuard in front of it. Should the rule lose its
  // canActivate, RolesGuard belongs ahead of the read like on the other file
  // routes - fileEditRolesRules.spec.ts pins those.
  it('should decide from the case', () => {
    const rule = districtCourtJudgeConfirmRulingOrderRule

    // A bare UserRole is a string and has nowhere to put a canActivate.
    expect(
      typeof rule === 'string' ? undefined : rule.canActivate,
    ).toBeInstanceOf(Function)
  })
})

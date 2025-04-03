import { districtCourtJudgeRule, prosecutorRule } from '../../../guards'
import { verifyRolesRules } from '../../case/guards/test/testHelper'
import { VictimController } from '../victim.controller'

describe('VictimController - Create Roles', () => {
  verifyRolesRules(VictimController, 'create', [
    prosecutorRule,
    districtCourtJudgeRule,
  ])
})

describe('VictimController - Update Roles', () => {
  verifyRolesRules(VictimController, 'update', [
    prosecutorRule,
    districtCourtJudgeRule,
  ])
})

describe('VictimController - Delete Roles', () => {
  verifyRolesRules(VictimController, 'delete', [
    prosecutorRule,
    districtCourtJudgeRule,
  ])
})

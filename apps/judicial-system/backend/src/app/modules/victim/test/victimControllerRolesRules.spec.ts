import { districtCourtJudgeRule, prosecutorRule } from '../../../guards'
import { testRolesRules } from '../../case/guards/test/testHelper'
import { VictimController } from '../victim.controller'

describe('VictimController - Create Roles', () => {
  testRolesRules(VictimController, 'create', [
    prosecutorRule,
    districtCourtJudgeRule,
  ])
})

describe('VictimController - Update Roles', () => {
  testRolesRules(VictimController, 'update', [
    prosecutorRule,
    districtCourtJudgeRule,
  ])
})

describe('VictimController - Delete Roles', () => {
  testRolesRules(VictimController, 'delete', [
    prosecutorRule,
    districtCourtJudgeRule,
  ])
})

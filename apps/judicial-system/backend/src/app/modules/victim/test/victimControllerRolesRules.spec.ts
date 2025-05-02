import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRule,
} from '../../../guards'
import { verifyRolesRules } from '../../../test'
import { VictimController } from '../victim.controller'

describe('VictimController - Create Roles', () => {
  verifyRolesRules(VictimController, 'create', [prosecutorRule])
})

describe('VictimController - Update Roles', () => {
  verifyRolesRules(VictimController, 'update', [
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  ])
})

describe('VictimController - Delete Roles', () => {
  verifyRolesRules(VictimController, 'delete', [prosecutorRule])
})

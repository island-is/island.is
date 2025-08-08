import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
<<<<<<< HEAD
  publicProsecutorStaffRule,
=======
>>>>>>> main
} from '../../../guards'
import { verifyRolesRules } from '../../../test'
import { VerdictController } from '../verdict.controller'

describe('VerdictController - Update Roles', () => {
  verifyRolesRules(VerdictController, 'update', [
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
<<<<<<< HEAD
    publicProsecutorStaffRule,
=======
>>>>>>> main
  ])
})

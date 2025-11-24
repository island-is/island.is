import { defenderRule, prisonSystemStaffRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Get case file signed url rules', () => {
  verifyRolesRules(LimitedAccessFileController, 'getCaseFileSignedUrl', [
    prisonSystemStaffRule,
    defenderRule,
  ])
})

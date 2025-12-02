import { defenderRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create case file rules', () => {
  verifyRolesRules(LimitedAccessFileController, 'createCaseFile', [
    defenderRule,
  ])
})

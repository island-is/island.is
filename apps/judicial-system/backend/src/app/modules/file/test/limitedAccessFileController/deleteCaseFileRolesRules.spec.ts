import { defenderRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Delete case file rules', () => {
  verifyRolesRules(LimitedAccessFileController, 'deleteCaseFile', [
    defenderRule,
  ])
})

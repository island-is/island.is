import { defenderRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create defendant case file rules', () => {
  verifyRolesRules(
    LimitedAccessFileController,
    'createDefendantCaseFile',
    [defenderRule],
  )
})

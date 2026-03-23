import { defenderRule } from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create presigned post rules', () => {
  verifyRolesRules(LimitedAccessFileController, 'createPresignedPost', [
    defenderRule,
  ])
})

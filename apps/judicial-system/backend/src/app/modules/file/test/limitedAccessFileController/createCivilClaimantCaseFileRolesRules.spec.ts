import { verifyRolesRules } from '../../../../test'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create civil claimant case file rules', () => {
  verifyRolesRules(
    LimitedAccessFileController,
    'createCivilClaimantCaseFile',
    [],
  )
})

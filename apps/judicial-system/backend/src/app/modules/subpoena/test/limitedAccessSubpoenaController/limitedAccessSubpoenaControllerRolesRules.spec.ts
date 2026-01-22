import { verifyRolesRules } from '../../../../test'
import { defenderGeneratedPdfRule } from '../../../case'
import { LimitedAccessSubpoenaController } from '../../limitedAccessSubpoena.controller'

describe('LimitedAccessSubpoenaController - Get Subpoeana PDF Roles', () => {
  verifyRolesRules(LimitedAccessSubpoenaController, 'getSubpoenaPdf', [
    defenderGeneratedPdfRule,
  ])
})

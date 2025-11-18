import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'

describe('CaseController - Get connected cases guards', () => {
  verifyGuards(CaseController, 'getConnectedCases', [CaseExistsGuard])
})

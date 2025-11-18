import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'

describe('CaseController - Get by id guards', () => {
  verifyGuards(CaseController, 'getById', [CaseExistsGuard, CaseReadGuard])
})

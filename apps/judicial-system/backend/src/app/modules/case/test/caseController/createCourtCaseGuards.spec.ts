import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'

describe('CaseController - Create court case guards', () => {
  verifyGuards(CaseController, 'createCourtCase', [
    CaseExistsGuard,
    CaseWriteGuard,
  ])
})

import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseTransitionGuard } from '../../guards/caseTransition.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'

describe('CaseController - Transition guards', () => {
  verifyGuards(CaseController, 'transition', [
    CaseExistsGuard,
    CaseWriteGuard,
    CaseTransitionGuard,
  ])
})

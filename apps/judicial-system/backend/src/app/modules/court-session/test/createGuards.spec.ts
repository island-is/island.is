import { verifyGuards } from '../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../case'
import { CourtSessionController } from '../courtSession.controller'

describe('CourtSessionController - Create', () => {
  verifyGuards(CourtSessionController, 'create', [
    CaseExistsGuard,
    CaseWriteGuard,
  ])
})

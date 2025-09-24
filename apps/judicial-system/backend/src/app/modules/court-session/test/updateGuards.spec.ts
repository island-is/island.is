import { verifyGuards } from '../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../case'
import { CourtSessionController } from '../courtSession.controller'
import { CourtSessionExistsGuard } from '../guards/courtSessionExists.guard'

describe('CourtSessionController - Update', () => {
  verifyGuards(CourtSessionController, 'update', [
    CaseExistsGuard,
    CaseWriteGuard,
    CourtSessionExistsGuard,
  ])
})

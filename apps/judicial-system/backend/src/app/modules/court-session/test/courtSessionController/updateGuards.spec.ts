import { verifyGuards } from '../../../../test'
import { CourtSessionController } from '../../courtSession.controller'
import { CourtSessionExistsGuard } from '../../guards/courtSessionExists.guard'

describe('CourtSessionController - Update', () => {
  verifyGuards(CourtSessionController, 'update', [CourtSessionExistsGuard])
})

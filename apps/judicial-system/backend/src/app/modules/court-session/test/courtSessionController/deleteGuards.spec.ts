import { verifyGuards } from '../../../../test'
import { CourtSessionController } from '../../courtSession.controller'
import { CourtSessionExistsGuard } from '../../guards/courtSessionExists.guard'

describe('CourtSessionController - Delete', () => {
  verifyGuards(CourtSessionController, 'delete', [CourtSessionExistsGuard])
})

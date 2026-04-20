import { verifyGuards } from '../../../../test'
import { CourtSessionController } from '../../courtSession.controller'

describe('CourtSessionController - Create', () => {
  verifyGuards(CourtSessionController, 'create', [])
})

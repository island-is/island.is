import { verifyGuards } from '../../../../test'
import { DefendantController } from '../../defendant.controller'

describe('DefendantController - Create guards', () => {
  verifyGuards(DefendantController, 'create', [])
})

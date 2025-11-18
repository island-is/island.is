import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Get all guards', () => {
  verifyGuards(CaseController, 'getAll', [])
})

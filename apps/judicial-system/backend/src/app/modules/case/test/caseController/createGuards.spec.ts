import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'

describe('CaseController - Create guards', () => {
  verifyGuards(CaseController, 'create', [])
})

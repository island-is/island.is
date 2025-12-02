import { verifyGuards } from '../../../../test'
import { DefendantController } from '../../defendant.controller'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'

describe('DefendantController - Delete guards', () => {
  verifyGuards(DefendantController, 'delete', [DefendantExistsGuard])
})

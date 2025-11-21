import { verifyGuards } from '../../../../test'
import { CourtDocumentController } from '../../courtDocument.controller'
import { CourtSessionExistsGuard } from '../../guards/courtSessionExists.guard'

describe('CourtDocumentController - Create', () => {
  verifyGuards(CourtDocumentController, 'create', [CourtSessionExistsGuard])
})

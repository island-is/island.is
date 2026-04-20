import { verifyGuards } from '../../../../test'
import { CourtDocumentController } from '../../courtDocument.controller'
import { CourtSessionExistsGuard } from '../../guards/courtSessionExists.guard'
import { FiledCourtDocumentExistsGuard } from '../../guards/filedCourtDocumentExists.guard'

describe('CourtDocumentController - Delete', () => {
  verifyGuards(CourtDocumentController, 'delete', [
    CourtSessionExistsGuard,
    FiledCourtDocumentExistsGuard,
  ])
})

import { verifyGuards } from '../../../../test'
import { CourtDocumentController } from '../../courtDocument.controller'
import { UnfiledCourtDocumentExistsGuard } from '../../guards/unfiledCourtDocumentExists.guard'

describe('CourtDocumentController - File in Court Session', () => {
  verifyGuards(CourtDocumentController, 'fileInCourtSession', [
    UnfiledCourtDocumentExistsGuard,
  ])
})

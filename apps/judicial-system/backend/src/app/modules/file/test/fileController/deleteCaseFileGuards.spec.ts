import { verifyGuards } from '../../../../test'
import { CaseWriteGuard } from '../../../case'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'

describe('FileController - Delete case file guards', () => {
  verifyGuards(FileController, 'deleteCaseFile', [
    CaseWriteGuard,
    CaseFileExistsGuard,
  ])
})

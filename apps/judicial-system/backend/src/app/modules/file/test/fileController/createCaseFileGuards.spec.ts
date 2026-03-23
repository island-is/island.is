import { verifyGuards } from '../../../../test'
import { CaseWriteGuard } from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Create case file guards', () => {
  verifyGuards(FileController, 'createCaseFile', [CaseWriteGuard])
})

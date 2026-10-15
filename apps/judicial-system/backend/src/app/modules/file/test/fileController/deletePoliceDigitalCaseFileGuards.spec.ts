import { verifyGuards, verifyInterceptors } from '../../../../test'
import { CaseOriginalAncestorInterceptor, CaseWriteGuard } from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Delete police digital case file guards', () => {
  verifyGuards(FileController, 'deletePoliceDigitalCaseFile', [CaseWriteGuard])

  verifyInterceptors(FileController, 'deletePoliceDigitalCaseFile', [
    CaseOriginalAncestorInterceptor,
  ])
})

import { verifyGuards } from '../../../../test'
import { CaseWriteGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { FileController } from '../../file.controller'

describe('FileController - Upload criminal record file guards', () => {
  verifyGuards(FileController, 'uploadCriminalRecordFile', [
    CaseWriteGuard,
    DefendantExistsGuard,
  ])
})

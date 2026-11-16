import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { FileController } from '../../file.controller'

describe('FileController - Upload criminal record file guards', () => {
  verifyGuards(FileController, 'uploadCriminalRecordFile', [
    CaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
    DefendantExistsGuard,
  ])
})

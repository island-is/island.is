import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Create case file guards', () => {
  verifyGuards(FileController, 'createCaseFile', [
    CaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
  ])
})

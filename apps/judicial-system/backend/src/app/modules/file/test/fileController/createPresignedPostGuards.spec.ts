import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Create presigned post guards', () => {
  verifyGuards(FileController, 'createPresignedPost', [
    CaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
  ])
})

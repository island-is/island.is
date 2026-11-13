import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { DeleteAppealCaseFileGuard } from '../../guards/deleteAppealCaseFile.guard'

describe('FileController - Delete case file guards', () => {
  verifyGuards(FileController, 'deleteCaseFile', [
    CaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
    CaseFileExistsGuard,
    DeleteAppealCaseFileGuard,
  ])
})

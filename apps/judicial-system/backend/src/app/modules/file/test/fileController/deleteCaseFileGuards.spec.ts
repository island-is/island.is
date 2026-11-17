import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsForUpdateGuard, CaseWriteGuard } from '../../../case'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { DeleteAppealCaseFileGuard } from '../../guards/deleteAppealCaseFile.guard'

describe('FileController - Delete case file guards', () => {
  verifyGuards(FileController, 'deleteCaseFile', [
    RolesGuard,
    CaseExistsForUpdateGuard,
    CaseWriteGuard,
    CaseFileExistsGuard,
    DeleteAppealCaseFileGuard,
  ])
})

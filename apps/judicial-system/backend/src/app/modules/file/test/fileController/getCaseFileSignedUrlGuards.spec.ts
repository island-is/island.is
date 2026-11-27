import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseReadGuard } from '../../../case'
import { MergedCaseExistsGuard } from '../../../case/guards/mergedCaseExists.guard'
import { FileController } from '../../file.controller'
import { SplitCaseFileExistsGuard } from '../../guards/splitCaseFileExists.guard'
import { ViewCaseFileGuard } from '../../guards/viewCaseFile.guard'

describe('FileController - Get case file signed url guards', () => {
  verifyGuards(FileController, 'getCaseFileSignedUrl', [
    CaseExistsGuard,
    RolesGuard,
    CaseReadGuard,
    MergedCaseExistsGuard,
    SplitCaseFileExistsGuard,
    ViewCaseFileGuard,
  ])
})

import { verifyGuards } from '../../../../test'
import { CaseReadGuard } from '../../../case'
import { MergedCaseExistsGuard } from '../../../case/guards/mergedCaseExists.guard'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { ViewCaseFileGuard } from '../../guards/viewCaseFile.guard'

describe('FileController - Get case file signed url guards', () => {
  verifyGuards(FileController, 'getCaseFileSignedUrl', [
    CaseReadGuard,
    MergedCaseExistsGuard,
    CaseFileExistsGuard,
    ViewCaseFileGuard,
  ])
})

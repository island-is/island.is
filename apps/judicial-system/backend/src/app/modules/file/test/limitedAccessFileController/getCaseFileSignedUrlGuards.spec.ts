import { verifyGuards } from '../../../../test'
import { CaseReadGuard } from '../../../case'
import { MergedCaseExistsGuard } from '../../../case/guards/mergedCaseExists.guard'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { LimitedAccessViewCaseFileGuard } from '../../guards/limitedAccessViewCaseFile.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Get case file signed url guards', () => {
  verifyGuards(LimitedAccessFileController, 'getCaseFileSignedUrl', [
    CaseReadGuard,
    MergedCaseExistsGuard,
    CaseFileExistsGuard,
    LimitedAccessViewCaseFileGuard,
  ])
})

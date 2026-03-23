import { verifyGuards } from '../../../../test'
import { CaseReadGuard } from '../../../case'
import { MergedCaseExistsGuard } from '../../../case/guards/mergedCaseExists.guard'
import { LimitedAccessViewCaseFileGuard } from '../../guards/limitedAccessViewCaseFile.guard'
import { SplitCaseFileExistsGuard } from '../../guards/splitCaseFileExists.guard'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Get case file signed url guards', () => {
  verifyGuards(LimitedAccessFileController, 'getCaseFileSignedUrl', [
    CaseReadGuard,
    MergedCaseExistsGuard,
    SplitCaseFileExistsGuard,
    LimitedAccessViewCaseFileGuard,
  ])
})

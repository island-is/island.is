import { TokenGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard } from '../../../case'
import { SplitCaseFileExistsGuard } from '../../guards/splitCaseFileExists.guard'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalFileController - Top-level guards', () => {
  verifyGuards(InternalFileController, undefined, [
    TokenGuard,
    CaseExistsGuard,
    SplitCaseFileExistsGuard,
  ])
})

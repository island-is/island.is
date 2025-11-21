import { TokenGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard } from '../../../case'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalFileController - Top-level guards', () => {
  verifyGuards(InternalFileController, undefined, [
    TokenGuard,
    CaseExistsGuard,
    CaseFileExistsGuard,
  ])
})

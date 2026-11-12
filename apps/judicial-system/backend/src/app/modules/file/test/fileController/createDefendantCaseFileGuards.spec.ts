import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsGuard, CaseWriteGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { FileController } from '../../file.controller'
import { CreateDefendantCaseFileGuard } from '../../guards/createDefendantCaseFile.guard'

describe('FileController - Create defendant case file guards', () => {
  verifyGuards(FileController, 'createDefendantCaseFile', [
    CaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
    DefendantExistsGuard,
    CreateDefendantCaseFileGuard,
  ])
})

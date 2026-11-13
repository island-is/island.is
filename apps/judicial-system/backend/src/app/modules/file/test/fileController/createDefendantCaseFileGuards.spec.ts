import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsForUpdateGuard, CaseWriteGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { FileController } from '../../file.controller'
import { CreateDefendantCaseFileGuard } from '../../guards/createDefendantCaseFile.guard'

describe('FileController - Create defendant case file guards', () => {
  verifyGuards(FileController, 'createDefendantCaseFile', [
    RolesGuard,
    CaseExistsForUpdateGuard,
    CaseWriteGuard,
    DefendantExistsGuard,
    CreateDefendantCaseFileGuard,
  ])
})

import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../../test'
import { CaseExistsForUpdateGuard, CaseWriteGuard } from '../../../case'
import { CivilClaimantExistsGuard } from '../../../defendant'
import { FileController } from '../../file.controller'
import { CreateCivilClaimantCaseFileGuard } from '../../guards/createCivilClaimantCaseFile.guard'

describe('FileController - Create civil claimant case file guards', () => {
  verifyGuards(FileController, 'createCivilClaimantCaseFile', [
    RolesGuard,
    CaseExistsForUpdateGuard,
    CaseWriteGuard,
    CivilClaimantExistsGuard,
    CreateCivilClaimantCaseFileGuard,
  ])
})

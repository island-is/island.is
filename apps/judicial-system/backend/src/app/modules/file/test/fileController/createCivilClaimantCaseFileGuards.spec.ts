import { verifyGuards } from '../../../../test'
import { CaseWriteGuard } from '../../../case'
import { CivilClaimantExistsGuard } from '../../../defendant'
import { FileController } from '../../file.controller'
import { CreateCivilClaimantCaseFileGuard } from '../../guards/createCivilClaimantCaseFile.guard'

describe('FileController - Create civil claimant case file guards', () => {
  verifyGuards(FileController, 'createCivilClaimantCaseFile', [
    CaseWriteGuard,
    CivilClaimantExistsGuard,
    CreateCivilClaimantCaseFileGuard,
  ])
})

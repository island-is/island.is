import { verifyGuards } from '../../../../test'
import { CaseWriteGuard } from '../../../case'
import { DefendantExistsGuard } from '../../../defendant'
import { FileController } from '../../file.controller'
import { CreateDefendantCaseFileGuard } from '../../guards/createDefendantCaseFile.guard'

describe('FileController - Create defendant case file guards', () => {
  verifyGuards(FileController, 'createDefendantCaseFile', [
    CaseWriteGuard,
    DefendantExistsGuard,
    CreateDefendantCaseFileGuard,
  ])
})

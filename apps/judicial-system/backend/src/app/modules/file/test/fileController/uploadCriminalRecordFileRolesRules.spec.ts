import {
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { FileController } from '../../file.controller'

describe('FileController - Upload criminal record file rules', () => {
  verifyRolesRules(FileController, 'uploadCriminalRecordFile', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

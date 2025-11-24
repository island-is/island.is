import {
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { verifyRolesRules } from '../../../../test'
import { FileController } from '../../file.controller'

describe('FileController - Update case file to court rules', () => {
  verifyRolesRules(FileController, 'updateFiles', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

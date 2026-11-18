import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards, verifyInterceptors } from '../../../../test'
import {
  CaseExistsGuard,
  CaseOriginalAncestorInterceptor,
  CaseWriteGuard,
} from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Delete police digital case file guards', () => {
  verifyGuards(FileController, 'deletePoliceDigitalCaseFile', [
    CaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
  ])

  verifyInterceptors(FileController, 'deletePoliceDigitalCaseFile', [
    CaseOriginalAncestorInterceptor,
  ])
})

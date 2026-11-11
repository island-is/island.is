import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards, verifyInterceptors } from '../../../../test'
import {
  CaseExistsGuard,
  CaseOriginalAncestorInterceptor,
  CaseReadGuard,
} from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Get police digital case file token url guards', () => {
  verifyGuards(FileController, 'getPoliceDigitalCaseFileTokenUrl', [
    CaseExistsGuard,
    RolesGuard,
    CaseReadGuard,
  ])

  verifyInterceptors(FileController, 'getPoliceDigitalCaseFileTokenUrl', [
    CaseOriginalAncestorInterceptor,
  ])
})

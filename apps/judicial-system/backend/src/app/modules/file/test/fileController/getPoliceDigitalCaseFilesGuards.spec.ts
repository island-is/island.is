import { RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards, verifyInterceptors } from '../../../../test'
import {
  CaseExistsGuard,
  CaseOriginalAncestorInterceptor,
  CaseReadGuard,
} from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Get police digital case files guards', () => {
  verifyGuards(FileController, 'getPoliceDigitalCaseFiles', [
    CaseExistsGuard,
    RolesGuard,
    CaseReadGuard,
  ])

  // The guards above run against the case in the url. The interceptor then
  // swaps in the original ancestor, where the police digital case files live.
  verifyInterceptors(FileController, 'getPoliceDigitalCaseFiles', [
    CaseOriginalAncestorInterceptor,
  ])
})

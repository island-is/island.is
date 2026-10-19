import { verifyGuards, verifyInterceptors } from '../../../../test'
import { CaseOriginalAncestorInterceptor, CaseReadGuard } from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Get police digital case files guards', () => {
  verifyGuards(FileController, 'getPoliceDigitalCaseFiles', [CaseReadGuard])

  // The guard above runs against the case in the url. The interceptor then
  // swaps in the original ancestor, where the police digital case files live.
  verifyInterceptors(FileController, 'getPoliceDigitalCaseFiles', [
    CaseOriginalAncestorInterceptor,
  ])
})

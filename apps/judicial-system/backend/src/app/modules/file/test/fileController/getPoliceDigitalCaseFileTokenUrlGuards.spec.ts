import { verifyGuards, verifyInterceptors } from '../../../../test'
import { CaseOriginalAncestorInterceptor, CaseReadGuard } from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Get police digital case file token url guards', () => {
  verifyGuards(FileController, 'getPoliceDigitalCaseFileTokenUrl', [
    CaseReadGuard,
  ])

  verifyInterceptors(FileController, 'getPoliceDigitalCaseFileTokenUrl', [
    CaseOriginalAncestorInterceptor,
  ])
})

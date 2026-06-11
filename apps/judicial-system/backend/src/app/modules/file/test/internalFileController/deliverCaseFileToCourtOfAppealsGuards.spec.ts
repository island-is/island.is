import { verifyGuards } from '../../../../test'
import { AppealCaseExistsGuard } from '../../../appeal-case'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalCaseController - Deliver case file to court of appeals guards', () => {
  verifyGuards(InternalFileController, 'deliverCaseFileToCourtOfAppeals', [
    AppealCaseExistsGuard,
  ])
})

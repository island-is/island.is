import { verifyRolesRules } from '../../../../test'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalFileController - Deliver case file to police guards', () => {
  verifyRolesRules(InternalFileController, 'deliverCaseFileToPolice', [])
})

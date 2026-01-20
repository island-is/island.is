import { verifyGuards } from '../../../../test'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalFileController - Deliver case file to police guards', () => {
  verifyGuards(InternalFileController, 'deliverCaseFileToPolice', [])
})

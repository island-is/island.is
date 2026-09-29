import { verifyGuards } from '../../../../test'
import { InternalFileController } from '../../internalFile.controller'

describe('InternalFileController - Deliver duplicated case file to storage guards', () => {
  verifyGuards(InternalFileController, 'deliverDuplicatedCaseFileToStorage', [])
})

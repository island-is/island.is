import { verifyGuards } from '../../../../test'
import { CaseWriteGuard } from '../../../case'
import { FileController } from '../../file.controller'

describe('FileController - Create presigned post guards', () => {
  verifyGuards(FileController, 'createPresignedPost', [CaseWriteGuard])
})

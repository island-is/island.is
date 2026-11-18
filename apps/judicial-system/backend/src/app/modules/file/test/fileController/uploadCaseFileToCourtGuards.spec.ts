import { RolesGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import {
  CaseExistsGuard,
  CaseReceivedGuard,
  CaseWriteGuard,
} from '../../../case'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { FileController } from '../../file.controller'
import { CaseFileExistsGuard } from '../../guards/caseFileExists.guard'

describe('FileController - Upload case file to court guards', () => {
  verifyGuards(
    FileController,
    'uploadCaseFileToCourt',
    [
      CaseExistsGuard,
      RolesGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      CaseReceivedGuard,
      CaseFileExistsGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: [...restrictionCases, ...investigationCases],
        },
      },
    ],
  )
})

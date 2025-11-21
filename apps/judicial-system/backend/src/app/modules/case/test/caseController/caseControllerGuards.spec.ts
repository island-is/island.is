import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseType,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { CaseController } from '../../case.controller'
import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseTransitionGuard } from '../../guards/caseTransition.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'
import { MergedCaseExistsGuard } from '../../guards/mergedCaseExists.guard'

describe('CaseController - Top-level guards', () => {
  verifyGuards(CaseController, undefined, [JwtAuthUserGuard, RolesGuard])
})

describe('CaseController - Create guards', () => {
  verifyGuards(CaseController, 'create', [])
})

describe('CaseController - Update guards', () => {
  verifyGuards(CaseController, 'update', [CaseExistsGuard, CaseWriteGuard])
})

describe('CaseController - Transition guards', () => {
  verifyGuards(CaseController, 'transition', [
    CaseExistsGuard,
    CaseWriteGuard,
    CaseTransitionGuard,
  ])
})

describe('CaseController - Get all guards', () => {
  verifyGuards(CaseController, 'getAll', [])
})

describe('CaseController - Get by id guards', () => {
  verifyGuards(CaseController, 'getById', [CaseExistsGuard, CaseReadGuard])
})

describe('CaseController - Get connected cases guards', () => {
  verifyGuards(CaseController, 'getConnectedCases', [CaseExistsGuard])
})

describe('CaseController - Get request pdf guards', () => {
  verifyGuards(
    CaseController,
    'getRequestPdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
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

describe('CaseController - Get case files record pdf guards', () => {
  verifyGuards(
    CaseController,
    'getCaseFilesRecordPdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard, MergedCaseExistsGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('CaseController - Get court record pdf guards', () => {
  verifyGuards(
    CaseController,
    'getCourtRecordPdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard, MergedCaseExistsGuard],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: [
            ...restrictionCases,
            ...investigationCases,
            ...indictmentCases,
          ],
        },
      },
    ],
  )
})

describe('CaseController - Get ruling pdf guards', () => {
  verifyGuards(
    CaseController,
    'getRulingPdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
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

describe('CaseController - Get custody notice pdf guards', () => {
  verifyGuards(
    CaseController,
    'getCustodyNoticePdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard, CaseCompletedGuard],
    [
      {
        guard: CaseTypeGuard,
        prop: {
          allowedCaseTypes: [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY],
        },
      },
    ],
  )
})

describe('CaseController - Get indictment pdf guards', () => {
  verifyGuards(
    CaseController,
    'getIndictmentPdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard, MergedCaseExistsGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('CaseController - Get ruling sent to prison admin pdf guards', () => {
  verifyGuards(
    CaseController,
    'getRulingSentToPrisonAdminPdf',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('CaseController - Request court record signature guards', () => {
  verifyGuards(
    CaseController,
    'requestCourtRecordSignature',
    [CaseExistsGuard, CaseTypeGuard, CaseWriteGuard],
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

describe('CaseController - Get court record signature confirmation guards', () => {
  verifyGuards(
    CaseController,
    'getCourtRecordSignatureConfirmation',
    [CaseExistsGuard, CaseTypeGuard, CaseWriteGuard],
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

describe('CaseController - Request ruling signature guards', () => {
  verifyGuards(
    CaseController,
    'requestRulingSignature',
    [CaseExistsGuard, CaseTypeGuard, CaseWriteGuard],
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

describe('CaseController - Get ruling signature confirmation guards', () => {
  verifyGuards(
    CaseController,
    'getRulingSignatureConfirmation',
    [CaseExistsGuard, CaseTypeGuard, CaseWriteGuard],
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

describe('CaseController - Extend guards', () => {
  verifyGuards(
    CaseController,
    'extend',
    [CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
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

describe('CaseController - Create court case guards', () => {
  verifyGuards(CaseController, 'createCourtCase', [
    CaseExistsGuard,
    CaseWriteGuard,
  ])
})

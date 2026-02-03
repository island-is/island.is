import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseType,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../../test'
import { DefendantExistsGuard } from '../../../defendant'
import { CaseController } from '../../case.controller'
import { CaseCompletedGuard } from '../../guards/caseCompleted.guard'
import { CaseExistsGuard } from '../../guards/caseExists.guard'
import { CaseReadGuard } from '../../guards/caseRead.guard'
import { CaseTransitionGuard } from '../../guards/caseTransition.guard'
import { CaseTypeGuard } from '../../guards/caseType.guard'
import { CaseWriteGuard } from '../../guards/caseWrite.guard'
import { MergedCaseExistsGuard } from '../../guards/mergedCaseExists.guard'

describe('CaseController - Top-level guards', () => {
  verifyGuards(CaseController, undefined, [JwtAuthUserGuard])
})

describe('CaseController - Create guards', () => {
  verifyGuards(CaseController, 'create', [RolesGuard])
})

describe('CaseController - Update guards', () => {
  verifyGuards(CaseController, 'update', [
    RolesGuard,
    CaseExistsGuard,
    CaseWriteGuard,
  ])
})

describe('CaseController - Transition guards', () => {
  verifyGuards(CaseController, 'transition', [
    CaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
    CaseTransitionGuard,
  ])
})

describe('CaseController - Get all guards', () => {
  verifyGuards(CaseController, 'getAll', [RolesGuard])
})

describe('CaseController - Get by id guards', () => {
  verifyGuards(CaseController, 'getById', [
    RolesGuard,
    CaseExistsGuard,
    CaseReadGuard,
  ])
})

describe('CaseController - Get connected cases guards', () => {
  verifyGuards(
    CaseController,
    'getConnectedCases',
    [RolesGuard, CaseExistsGuard, CaseTypeGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('CaseController - Get candidate merge cases guards', () => {
  verifyGuards(
    CaseController,
    'getCandidateMergeCases',
    [RolesGuard, CaseExistsGuard, CaseTypeGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('CaseController - Get request pdf guards', () => {
  verifyGuards(
    CaseController,
    'getRequestPdf',
    [RolesGuard, CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
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
    [
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      MergedCaseExistsGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('CaseController - Get court record pdf guards', () => {
  verifyGuards(
    CaseController,
    'getCourtRecordPdf',
    [
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      MergedCaseExistsGuard,
    ],
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
    [RolesGuard, CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
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
    [
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      CaseCompletedGuard,
    ],
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
    [
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseReadGuard,
      MergedCaseExistsGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('CaseController - Get ruling sent to prison admin pdf guards', () => {
  verifyGuards(
    CaseController,
    'getRulingSentToPrisonAdminPdf',
    [RolesGuard, CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('CaseController - Request court record signature guards', () => {
  verifyGuards(
    CaseController,
    'requestCourtRecordSignature',
    [RolesGuard, CaseExistsGuard, CaseTypeGuard, CaseWriteGuard],
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
    [RolesGuard, CaseExistsGuard, CaseTypeGuard, CaseWriteGuard],
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
    [CaseExistsGuard, RolesGuard, CaseTypeGuard, CaseWriteGuard],
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
    [CaseExistsGuard, RolesGuard, CaseTypeGuard, CaseWriteGuard],
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
    [RolesGuard, CaseExistsGuard, CaseTypeGuard, CaseReadGuard],
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

describe('CaseController - Split defendant from case guards', () => {
  verifyGuards(
    CaseController,
    'splitDefendantFromCase',
    [
      RolesGuard,
      CaseExistsGuard,
      CaseTypeGuard,
      CaseWriteGuard,
      DefendantExistsGuard,
    ],
    [
      {
        guard: CaseTypeGuard,
        prop: { allowedCaseTypes: indictmentCases },
      },
    ],
  )
})

describe('CaseController - Create court case guards', () => {
  verifyGuards(CaseController, 'createCourtCase', [
    RolesGuard,
    CaseExistsGuard,
    CaseWriteGuard,
  ])
})

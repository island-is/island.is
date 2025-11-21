import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { verifyGuards } from '../../../test'
import {
  CaseTypeGuard,
  MinimalCaseAccessGuard,
  MinimalCaseExistsGuard,
} from '../../case'
import { IndictmentCountExistsGuard } from '../guards/indictmentCountExists.guard'
import { OffenseExistsGuard } from '../guards/offenseExists.guard'
import { IndictmentCountController } from '../indictmentCount.controller'

describe('IndictmentCountController - Top-level guards', () => {
  verifyGuards(
    IndictmentCountController,
    undefined,
    [
      JwtAuthUserGuard,
      RolesGuard,
      MinimalCaseExistsGuard,
      CaseTypeGuard,
      MinimalCaseAccessGuard,
    ],
    [{ guard: CaseTypeGuard, prop: { allowedCaseTypes: indictmentCases } }],
  )
})

describe('IndictmentCountController - Create', () => {
  verifyGuards(IndictmentCountController, 'create', [])
})

describe('IndictmentCountController - Update', () => {
  verifyGuards(IndictmentCountController, 'update', [
    IndictmentCountExistsGuard,
  ])
})

describe('IndictmentCountController - Delete', () => {
  verifyGuards(IndictmentCountController, 'delete', [
    IndictmentCountExistsGuard,
  ])
})

describe('IndictmentCountController - Create Offense', () => {
  verifyGuards(IndictmentCountController, 'createOffense', [
    IndictmentCountExistsGuard,
  ])
})

describe('IndictmentCountController - Update Offense', () => {
  verifyGuards(IndictmentCountController, 'updateOffense', [
    IndictmentCountExistsGuard,
    OffenseExistsGuard,
  ])
})

describe('IndictmentCountController - Delete Offense', () => {
  verifyGuards(IndictmentCountController, 'deleteOffense', [
    IndictmentCountExistsGuard,
    OffenseExistsGuard,
  ])
})

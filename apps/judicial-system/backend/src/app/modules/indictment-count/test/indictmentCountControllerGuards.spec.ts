import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { verifyGuards } from '../../../test'
import { MinimalCaseAccessGuard, MinimalCaseExistsGuard } from '../../case'
import { IndictmentCountExistsGuard } from '../guards/indictmentCountExists.guard'
import { OffenseExistsGuard } from '../guards/offenseExists.guard'
import { IndictmentCountController } from '../indictmentCount.controller'

describe('IndictmentCountController - Top-level guards', () => {
  verifyGuards(IndictmentCountController, undefined, [
    JwtAuthUserGuard,
    RolesGuard,
  ])
})

describe('IndictmentCountController - Create', () => {
  verifyGuards(IndictmentCountController, 'create', [
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
  ])
})

describe('IndictmentCountController - Update', () => {
  verifyGuards(IndictmentCountController, 'update', [
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
  ])
})

describe('IndictmentCountController - Delete', () => {
  verifyGuards(IndictmentCountController, 'delete', [
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
  ])
})

describe('IndictmentCountController - Create Offense', () => {
  verifyGuards(IndictmentCountController, 'createOffense', [
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
  ])
})

describe('IndictmentCountController - Update Offense', () => {
  verifyGuards(IndictmentCountController, 'updateOffense', [
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
    OffenseExistsGuard,
  ])
})

describe('IndictmentCountController - Delete Offense', () => {
  verifyGuards(IndictmentCountController, 'deleteOffense', [
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
    OffenseExistsGuard,
  ])
})

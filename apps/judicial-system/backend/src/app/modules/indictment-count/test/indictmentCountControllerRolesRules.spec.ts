import { prosecutorRepresentativeRule, prosecutorRule } from '../../../guards'
import { verifyRolesRules } from '../../../test'
import { IndictmentCountController } from '../indictmentCount.controller'

describe('IndictmentCountController - Create Roles', () => {
  verifyRolesRules(IndictmentCountController, 'create', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

describe('IndictmentCountController - Update Roles', () => {
  verifyRolesRules(IndictmentCountController, 'update', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

describe('IndictmentCountController - Delete Roles', () => {
  verifyRolesRules(IndictmentCountController, 'delete', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

describe('IndictmentCountController - Create Offense Roles', () => {
  verifyRolesRules(IndictmentCountController, 'createOffense', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

describe('IndictmentCountController - Update Offense Roles', () => {
  verifyRolesRules(IndictmentCountController, 'updateOffense', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

describe('IndictmentCountController - Delete Offense Roles', () => {
  verifyRolesRules(IndictmentCountController, 'deleteOffense', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

import { prosecutorRepresentativeRule, prosecutorRule } from '../../../guards'
import { verifyRolesRules } from '../../../test'
import { IndictmentCountsController } from '../indictmentCounts.controller'

describe('IndictmentCountsController - Reorder Roles', () => {
  verifyRolesRules(IndictmentCountsController, 'reorder', [
    prosecutorRule,
    prosecutorRepresentativeRule,
  ])
})

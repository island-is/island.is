import {
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { CivilClaimantController } from '../../civilClaimant.controller'

describe('CivilClaimantController - Delete rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  const expectedRules = [prosecutorRule, prosecutorRepresentativeRule]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CivilClaimantController.prototype.delete,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(expectedRules.length)
    expectedRules.forEach((expectedRule) =>
      expect(rules).toContain(expectedRule),
    )
  })
})

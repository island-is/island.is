import { defenderRule } from '../../../../guards'
import { LimitedAccessDefendantController } from '../../limitedAccessDefendant.controller'

describe('LimitedAccessDefendantController - Get custody notice pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessDefendantController.prototype.getSubpoenaPdf,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(defenderRule)
  })
})

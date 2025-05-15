import { defenderRule } from '../../../../guards'
import { prisonSystemAdminRulingPdfRule } from '../../guards/rolesRules'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get ruling pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessCaseController.prototype.getRulingPdf,
    )
  })

  it('should give permission to two roles', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(defenderRule)
    expect(rules).toContain(prisonSystemAdminRulingPdfRule)
  })
})

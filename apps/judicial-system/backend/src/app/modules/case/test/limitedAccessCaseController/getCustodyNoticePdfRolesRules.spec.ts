import { prisonSystemStaffRule } from '../../../../guards'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get custody notice pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessCaseController.prototype.getCustodyNoticePdf,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(prisonSystemStaffRule)
  })
})

import { prisonSystemStaffRule } from '../../../../guards'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get ruling sent to prison admin pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessCaseController.prototype.getRulingSentToPrisonAdminPdf,
    )
  })

  it('should give permission to 1 role', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(prisonSystemStaffRule)
  })
})

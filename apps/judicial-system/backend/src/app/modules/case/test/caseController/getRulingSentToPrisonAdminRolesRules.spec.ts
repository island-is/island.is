import { publicProsecutorStaffRule } from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get ruling sent to prison admin pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.getRulingSentToPrisonAdminPdf,
    )
  })

  it('should give permission to 1 role', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(publicProsecutorStaffRule)
  })
})

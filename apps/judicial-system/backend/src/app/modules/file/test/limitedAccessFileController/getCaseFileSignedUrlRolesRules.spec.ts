import { defenderRule, prisonSystemStaffRule } from '../../../../guards'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Get case file signed url rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessFileController.prototype.getCaseFileSignedUrl,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(prisonSystemStaffRule)
    expect(rules).toContain(defenderRule)
  })
})

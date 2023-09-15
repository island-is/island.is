import { prosecutorRule } from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Extend rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.extend)
  })

  it('should give permission to one role', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(prosecutorRule)
  })
})

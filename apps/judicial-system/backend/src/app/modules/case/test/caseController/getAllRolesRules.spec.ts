import { defenderRule } from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get all rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.getAll)
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(defenderRule)
  })
})

import {
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Create rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.create)
  })

  it('should give permission to two role', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
  })
})

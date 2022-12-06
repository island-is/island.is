import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
  staffRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get all rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.getAll)
  })

  it('should give permission to five roles', () => {
    expect(rules).toHaveLength(5)
  })

  it('should give permission to prosecutors, representatives, judges, registrars and staff', () => {
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(representativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(staffRule)
  })
})

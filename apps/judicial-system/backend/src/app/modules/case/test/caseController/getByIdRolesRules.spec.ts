import {
  assistantRule,
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
  staffRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get by id rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.getById)
  })

  it('should give permission to six roles', () => {
    expect(rules).toHaveLength(6)
  })

  it('should give permission to prosecutors, representatives, judges, registrars, assistants and staff', () => {
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(representativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(assistantRule)
    expect(rules).toContain(staffRule)
  })
})

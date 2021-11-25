import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  staffRule,
} from '../../../guards'
import { CaseController } from '../case.controller'

describe('CaseController - Get by id rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.getById)
  })

  it('should give permission to four roles', () => {
    expect(rules).toHaveLength(4)
  })

  it('should give permission to prosecutors', () => {
    expect(rules).toContain(prosecutorRule)
  })

  it('should have permission to judges', () => {
    expect(rules).toContain(judgeRule)
  })

  it('should have permission to registrars', () => {
    expect(rules).toContain(registrarRule)
  })

  it('should have permission to staff', () => {
    expect(rules).toContain(staffRule)
  })
})

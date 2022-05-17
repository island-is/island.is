import {
  judgeUpdateRule,
  prosecutorUpdateRule,
  registrarUpdateRule,
} from '../../guards/rolesRules'
import { CaseController } from '../../case.controller'

describe('CaseController - Update rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata('roles-rules', CaseController.prototype.update)
  })

  it('should give permission to three roles', () => {
    expect(rules).toHaveLength(3)
  })

  it('should give permission to prosecutors', () => {
    expect(rules).toContain(prosecutorUpdateRule)
  })

  it('should give permission to judges', () => {
    expect(rules).toContain(judgeUpdateRule)
  })

  it('should give permission to registrars', () => {
    expect(rules).toContain(registrarUpdateRule)
  })
})

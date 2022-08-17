import {
  judgeTransitionRule,
  prosecutorTransitionRule,
  registrarTransitionRule,
} from '../../guards/rolesRules'
import { CaseController } from '../../case.controller'

describe('CaseController - Transition rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.transition,
    )
  })

  it('should give permission to three roles', () => {
    expect(rules).toHaveLength(3)
  })

  it('should give permission to prosecutors', () => {
    expect(rules).toContain(prosecutorTransitionRule)
  })

  it('should give permission to judges', () => {
    expect(rules).toContain(judgeTransitionRule)
  })

  it('should give permission to registrars', () => {
    expect(rules).toContain(registrarTransitionRule)
  })
})

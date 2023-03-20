import {
  assistantTransitionRule,
  judgeTransitionRule,
  prosecutorTransitionRule,
  registrarTransitionRule,
  representativeTransitionRule,
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

  it('should give permission to five roles', () => {
    expect(rules).toHaveLength(5)
  })

  it('should give permission to prosecutors, representatives, judges, registrars and assistants', () => {
    expect(rules).toContain(prosecutorTransitionRule)
    expect(rules).toContain(representativeTransitionRule)
    expect(rules).toContain(judgeTransitionRule)
    expect(rules).toContain(registrarTransitionRule)
    expect(rules).toContain(assistantTransitionRule)
  })
})

import {
  assistantRule,
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
} from '../../../guards'
import { DefendantController } from '../defendant.controller'

describe('DefendantController - Update rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      DefendantController.prototype.update,
    )
  })

  it('should give permission to five roles', () => {
    expect(rules).toHaveLength(5)
  })

  it('should give permission to prosecutors, representatives, judges, registrars and assistants', () => {
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(representativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(assistantRule)
  })
})

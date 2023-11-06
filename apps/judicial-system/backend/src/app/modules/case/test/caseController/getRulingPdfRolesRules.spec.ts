import {
  assistantRule,
  judgeRule,
  prosecutorRule,
  registrarRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get ruling pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.getRulingPdf,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(4)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(assistantRule)
  })
})

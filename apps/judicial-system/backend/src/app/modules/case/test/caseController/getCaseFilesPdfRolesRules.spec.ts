import { judgeRule, prosecutorRule, registrarRule } from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get case files pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.getCaseFilesPdf,
    )
  })

  it('should give permission to thee roles', () => {
    expect(rules).toHaveLength(3)
  })

  it('should give permission to prosecutors', () => {
    expect(rules).toContain(prosecutorRule)
  })

  it('should give permission to judges', () => {
    expect(rules).toContain(judgeRule)
  })

  it('should give permission to registrars', () => {
    expect(rules).toContain(registrarRule)
  })
})

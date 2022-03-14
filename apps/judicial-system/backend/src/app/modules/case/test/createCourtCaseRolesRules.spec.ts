import { judgeRule, registrarRule } from '../../../guards'
import { CaseController } from '../case.controller'

describe('CaseController - Create court case rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.createCourtCase,
    )
  })

  it('should give permission to one role', () => {
    expect(rules).toHaveLength(2)
  })

  it('should give permission to judges', () => {
    expect(rules).toContain(judgeRule)
  })

  it('should give permission to registrars', () => {
    expect(rules).toContain(registrarRule)
  })
})

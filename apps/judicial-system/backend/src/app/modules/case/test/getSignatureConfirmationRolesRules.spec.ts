import { judgeRule } from '../../../guards'
import { CaseController } from '../case.controller'

describe('CaseController - Get signature confirmation rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.getSignatureConfirmation,
    )
  })

  it('should give permission to one roles', () => {
    expect(rules).toHaveLength(1)
  })

  it('should have permission to judges', () => {
    expect(rules).toContain(judgeRule)
  })
})

import { judgeRule, registrarRule } from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get court record signature confirmation rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.getCourtRecordSignatureConfirmation,
    )
  })

  it('should give permission to two roles', () => {
    expect(rules).toHaveLength(2)
  })

  it('should give permission to judges', () => {
    expect(rules).toContain(judgeRule)
  })

  it('should give permission to registrars', () => {
    expect(rules).toContain(registrarRule)
  })
})

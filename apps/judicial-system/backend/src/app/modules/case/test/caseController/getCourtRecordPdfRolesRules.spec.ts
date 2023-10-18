import {
  assistantRule,
  judgeRule,
  prisonSystemStaffRule,
  prosecutorRule,
  registrarRule,
} from '../../../../guards'
import { CaseController } from '../../case.controller'

describe('CaseController - Get court record pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      CaseController.prototype.getCourtRecordPdf,
    )
  })

  it('should give permission to five roles', () => {
    expect(rules).toHaveLength(5)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(prisonSystemStaffRule)
    expect(rules).toContain(assistantRule)
  })
})

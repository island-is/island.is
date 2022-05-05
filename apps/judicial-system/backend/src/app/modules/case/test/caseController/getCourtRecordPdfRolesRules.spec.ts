import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  staffRule,
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

  it('should give permission to four roles', () => {
    expect(rules).toHaveLength(4)
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

  it('should give permission to staff', () => {
    expect(rules).toContain(staffRule)
  })
})

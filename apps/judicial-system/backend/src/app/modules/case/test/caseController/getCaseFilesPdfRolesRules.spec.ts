import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
} from '../../../../guards'
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

  it('should give permission to four roles', () => {
    expect(rules).toHaveLength(4)
  })

  it('should give permission to prosecutors, representatives, judges and registrars', () => {
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(representativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
  })
})

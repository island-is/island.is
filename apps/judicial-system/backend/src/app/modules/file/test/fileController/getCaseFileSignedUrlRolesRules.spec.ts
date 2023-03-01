import {
  assistantRule,
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
} from '../../../../guards'
import { defenderFileRule } from '../../guards/rolesRules'
import { FileController } from '../../file.controller'

describe('FileController - Get case file signed url rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.getCaseFileSignedUrl,
    )
  })

  it('should give permission to six roles', () => {
    expect(rules).toHaveLength(6)
  })

  it('should give permission to prosecutors, representatives, judges, registrars, assistants and defenders', () => {
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(representativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(assistantRule)
    expect(rules).toContain(defenderFileRule)
  })
})

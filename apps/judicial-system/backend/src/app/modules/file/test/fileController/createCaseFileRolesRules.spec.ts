import { judgeRule, prosecutorRule, registrarRule } from '../../../../guards'
import { FileController } from '../../file.controller'

describe('FileController - Create case file rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.createCaseFile,
    )
  })

  it('should give permission to three role', () => {
    expect(rules).toHaveLength(3)
  })

  it('should give permission to prosecutors, judges and registrars', () => {
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
  })
})

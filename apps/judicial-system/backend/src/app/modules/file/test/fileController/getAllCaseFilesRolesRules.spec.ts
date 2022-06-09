import { judgeRule, prosecutorRule, registrarRule } from '../../../../guards'
import { FileController } from '../../file.controller'

describe('FileController - Get all case files rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.getAllCaseFiles,
    )
  })

  it('should give permission to three roles', () => {
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

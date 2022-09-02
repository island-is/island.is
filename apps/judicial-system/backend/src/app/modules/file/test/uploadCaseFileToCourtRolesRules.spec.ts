import { judgeRule, registrarRule } from '../../../guards'
import { FileController } from '../file.controller'

describe('FileController - Update case file to court rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.uploadCaseFileToCourt,
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

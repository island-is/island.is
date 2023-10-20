import {
  assistantRule,
  judgeRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  registrarRule,
} from '../../../../guards'
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

  it('should give permission to five role', () => {
    expect(rules).toHaveLength(5)
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(assistantRule)
  })
})

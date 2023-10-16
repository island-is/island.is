import {
  assistantRule,
  judgeRule,
  prisonSystemStaffRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  registrarRule,
} from '../../../../guards'
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
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(prosecutorRepresentativeRule)
    expect(rules).toContain(judgeRule)
    expect(rules).toContain(registrarRule)
    expect(rules).toContain(assistantRule)
    expect(rules).toContain(prisonSystemStaffRule)
  })
})

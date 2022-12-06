import { prosecutorRule, representativeRule } from '../../../../guards'
import { FileController } from '../../file.controller'

describe('FileController - Delete case file rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.deleteCaseFile,
    )
  })

  it('should give permission to two role', () => {
    expect(rules).toHaveLength(2)
  })

  it('should give permission to prosecutors and representatives', () => {
    expect(rules).toContain(prosecutorRule)
    expect(rules).toContain(representativeRule)
  })
})

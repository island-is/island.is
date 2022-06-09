import { prosecutorRule } from '../../../../guards'
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

  it('should give permission to one role', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to prosecutors', () => {
    expect(rules).toContain(prosecutorRule)
  })
})

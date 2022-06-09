import { prosecutorRule } from '../../../../guards'
import { FileController } from '../../file.controller'

describe('FileController - Create presigned post rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      FileController.prototype.createPresignedPost,
    )
  })

  it('should give permission to one role', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to prosecutors', () => {
    expect(rules).toContain(prosecutorRule)
  })
})

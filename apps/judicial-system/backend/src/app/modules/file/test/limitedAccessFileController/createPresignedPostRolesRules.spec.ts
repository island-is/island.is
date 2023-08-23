import { defenderRule } from '../../../../guards'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Create presigned post rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessFileController.prototype.createPresignedPost,
    )
  })

  it('should give permission to one role', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(defenderRule)
  })
})

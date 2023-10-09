import { defenderRule } from '../../../../guards'
import { LimitedAccessFileController } from '../../limitedAccessFile.controller'

describe('LimitedAccessFileController - Get case file signed url rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessFileController.prototype.getCaseFileSignedUrl,
    )
  })

  it('should give permission to one roles', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(defenderRule)
  })
})

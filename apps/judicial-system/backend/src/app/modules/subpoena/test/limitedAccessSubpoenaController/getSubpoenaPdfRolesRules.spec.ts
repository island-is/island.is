import { defenderGeneratedPdfRule } from '../../../case'
import { LimitedAccessSubpoenaController } from '../../limitedAccessSubpoena.controller'

describe('LimitedAccessSubpoenaController - Get custody notice pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      LimitedAccessSubpoenaController.prototype.getSubpoenaPdf,
    )
  })

  it('should give permission to roles', () => {
    expect(rules).toHaveLength(1)
    expect(rules).toContain(defenderGeneratedPdfRule)
  })
})

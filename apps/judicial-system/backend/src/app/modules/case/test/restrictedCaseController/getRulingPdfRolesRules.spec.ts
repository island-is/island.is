import { defenderRule } from '../../../../guards'
import { RestrictedCaseController } from '../../restrictedCase.controller'

describe('RestrictedCaseController - Get ruling pdf rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      RestrictedCaseController.prototype.getRulingPdf,
    )
  })

  it('should give permission to one role', () => {
    expect(rules).toHaveLength(1)
  })

  it('should give permission to staff', () => {
    expect(rules).toContain(defenderRule)
  })
})

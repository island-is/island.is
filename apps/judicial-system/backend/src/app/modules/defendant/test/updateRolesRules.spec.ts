import { judgeRule, prosecutorRule, registrarRule } from '../../../guards'
import { DefendantController } from '../defendant.controller'

describe('DefendantController - Update rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      DefendantController.prototype.update,
    )
  })

  it('should give permission to three roles', () => {
    expect(rules).toHaveLength(3)
  })

  it('should give permission to prosecutors, judges and registrars', () => {
    expect(rules).toContain([prosecutorRule, judgeRule, registrarRule])
  })
})

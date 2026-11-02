import { adminRule } from '../../../guards'
import { serviceInterruptionBannerManagerRule } from '../guards/rolesRules'
import { ServiceInterruptionBannerController } from '../serviceInterruptionBanner.controller'

describe('ServiceInterruptionBannerController - Update rules', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rules: any[]

  beforeEach(() => {
    rules = Reflect.getMetadata(
      'roles-rules',
      ServiceInterruptionBannerController.prototype.update,
    )
  })

  it('should give permission to admins and banner managers', () => {
    expect(rules).toHaveLength(2)
    expect(rules).toContain(adminRule)
    expect(rules).toContain(serviceInterruptionBannerManagerRule)
  })
})


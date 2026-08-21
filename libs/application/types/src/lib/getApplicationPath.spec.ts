import { ApplicationConfigurations, ApplicationTypes } from './ApplicationTypes'
import { getApplicationPath } from './getApplicationPath'

describe('getApplicationPath', () => {
  it('builds a legacy path under /umsoknir for non-SDF applications', () => {
    expect(
      getApplicationPath(ApplicationTypes.FIRE_COMPENSATION_APPRAISAL, 'abc'),
    ).toBe('umsoknir/endurmat-brunabotamats/abc')
  })

  it('builds a path under /umsoknir/sdf for SDF applications', () => {
    expect(
      getApplicationPath(
        ApplicationTypes.FIRE_COMPENSATION_APPRAISAL_SDF,
        'abc',
      ),
    ).toBe('umsoknir/sdf/endurmat-brunabotamats-sdf/abc')
  })

  it('uses the umsoknir/sdf prefix exactly when useSdf is set, for every configured type', () => {
    for (const [type, config] of Object.entries(ApplicationConfigurations)) {
      const path = getApplicationPath(type as ApplicationTypes, 'id-1')
      const expectedBase = config.useSdf ? 'umsoknir/sdf' : 'umsoknir'

      expect(path).toBe(`${expectedBase}/${config.slug}/id-1`)
    }
  })
})

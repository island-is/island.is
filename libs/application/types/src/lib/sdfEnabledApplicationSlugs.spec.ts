import { ApplicationConfigurations } from './ApplicationTypes'
import { SDF_ENABLED_APPLICATION_SLUGS } from './sdfEnabledApplicationSlugs'

describe('SDF_ENABLED_APPLICATION_SLUGS', () => {
  it('matches every ApplicationConfigurations entry with useSdf: true', () => {
    const expected = new Set(
      Object.values(ApplicationConfigurations)
        .filter((c) => 'useSdf' in c && c.useSdf)
        .map((c) => c.slug),
    )
    const actual = new Set(SDF_ENABLED_APPLICATION_SLUGS)

    expect(actual).toEqual(expected)
  })
})

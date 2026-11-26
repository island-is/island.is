import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'
import {
  getApplicationLink,
  getSlugFromType,
  getTypeFromSlug,
} from './configurationUtils'

describe('configuration utility functions', () => {
  it('should get the application type out of a slug', () => {
    expect(getTypeFromSlug(undefined)).toBe(undefined)
    expect(getTypeFromSlug('unknown')).toBe(undefined)
    expect(getTypeFromSlug('example-common-actions')).toBe(
      ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
    )
  })

  it('should get a slug out of an application type', () => {
    expect(getSlugFromType(ApplicationTypes.EXAMPLE_COMMON_ACTIONS)).toBe(
      'example-common-actions',
    )
  })
})

describe('getApplicationLink', () => {
  const application = {
    id: 'some-id',
    typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
  }

  it('should build a link from the origin, slug and application id', () => {
    expect(getApplicationLink(application, 'https://island.is/umsoknir')).toBe(
      'https://island.is/umsoknir/example-common-actions/some-id',
    )
  })

  it('should handle a trailing slash on the origin', () => {
    expect(getApplicationLink(application, 'https://island.is/umsoknir/')).toBe(
      'https://island.is/umsoknir/example-common-actions/some-id',
    )
  })

  it('should add /sdf after the origin for a server-driven application', () => {
    expect(
      getApplicationLink(
        { id: 'some-id', typeId: ApplicationTypes.EXAMPLE_INPUTS_SDF },
        'https://island.is/umsoknir',
      ),
    ).toBe('https://island.is/umsoknir/sdf/example-inputs-sdf/some-id')
  })

  it('should add /sdf exactly when useSdf is set, for every configured type', () => {
    for (const [type, config] of Object.entries(ApplicationConfigurations)) {
      const sdfSegment = config.useSdf ? '/sdf' : ''

      expect(
        getApplicationLink(
          { id: 'id-1', typeId: type as ApplicationTypes },
          'https://island.is/umsoknir',
        ),
      ).toBe(`https://island.is/umsoknir${sdfSegment}/${config.slug}/id-1`)
    }
  })

  it('should throw when the application type has no configured slug', () => {
    const unmapped = {
      id: 'some-id',
      typeId: 'NOT_A_REAL_TYPE' as ApplicationTypes,
    }

    expect(() =>
      getApplicationLink(unmapped, 'https://island.is/umsoknir'),
    ).toThrow()
  })
})

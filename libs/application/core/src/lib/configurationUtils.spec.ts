import { ApplicationTypes } from '@island.is/application/types'
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
})

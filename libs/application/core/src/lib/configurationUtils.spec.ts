import { ApplicationTypes } from '@island.is/application/types'
import { getSlugFromType, getTypeFromSlug } from './configurationUtils'

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

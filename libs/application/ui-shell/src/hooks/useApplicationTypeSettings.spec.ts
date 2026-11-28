import {
  ApplicationTypeAlertBanner,
  ApplicationTypeSettings,
  getApplicationTypeBannerId,
  resolveApplicationTypeSettings,
} from './useApplicationTypeSettings'

const banner = (
  title: string,
  overrides: Partial<ApplicationTypeAlertBanner> = {},
): ApplicationTypeAlertBanner => ({
  id: `banner-${title}`,
  showAlertBanner: true,
  bannerVariant: 'warning',
  title,
  description: `${title} description`,
  linkTitle: null,
  link: null,
  isDismissable: true,
  dismissedForDays: 7,
  ...overrides,
})

const settings = (
  applicationType: string,
  overrides: Partial<ApplicationTypeSettings> = {},
): ApplicationTypeSettings => ({
  id: `settings-${applicationType}`,
  applicationType,
  alertBanner: null,
  ...overrides,
})

describe('resolveApplicationTypeSettings', () => {
  it('returns nothing when there are no settings', () => {
    expect(resolveApplicationTypeSettings([])).toEqual({
      banners: [],
    })
  })

  it('returns visible banners with the global banner first', () => {
    const typeBanner = banner('type')
    const globalBanner = banner('global')

    const { banners } = resolveApplicationTypeSettings([
      settings('ParentalLeave', { alertBanner: typeBanner }),
      settings('*', { alertBanner: globalBanner }),
      settings('Other', {
        alertBanner: banner('hidden', { showAlertBanner: false }),
      }),
    ])

    expect(banners.map((b) => b.title)).toEqual(['global', 'type'])
    expect(banners[0].bannerId).toBe(getApplicationTypeBannerId(globalBanner))
  })
})

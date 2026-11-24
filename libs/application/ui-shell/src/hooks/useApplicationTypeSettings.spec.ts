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
  disableLeavingPrerequisites: false,
  blockedTitle: null,
  blockedMessage: null,
  alertBanner: null,
  ...overrides,
})

describe('resolveApplicationTypeSettings', () => {
  it('returns nothing when there are no settings', () => {
    expect(resolveApplicationTypeSettings([])).toEqual({
      banners: [],
      leavingPrerequisitesBlock: null,
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

  it('is not blocked when no settings disable leaving prerequisites', () => {
    const { leavingPrerequisitesBlock } = resolveApplicationTypeSettings([
      settings('ParentalLeave', { blockedMessage: 'not used' }),
    ])

    expect(leavingPrerequisitesBlock).toBeNull()
  })

  it('is blocked by the global settings', () => {
    const { leavingPrerequisitesBlock } = resolveApplicationTypeSettings([
      settings('*', { disableLeavingPrerequisites: true }),
    ])

    expect(leavingPrerequisitesBlock).toEqual({
      blockedTitle: null,
      blockedMessage: null,
    })
  })

  it('prefers type specific blocked texts over global ones', () => {
    const { leavingPrerequisitesBlock } = resolveApplicationTypeSettings([
      settings('*', {
        disableLeavingPrerequisites: true,
        blockedTitle: 'Global title',
        blockedMessage: 'Global message',
      }),
      settings('ParentalLeave', {
        disableLeavingPrerequisites: true,
        blockedMessage: 'Type message',
      }),
    ])

    expect(leavingPrerequisitesBlock).toEqual({
      blockedTitle: 'Global title',
      blockedMessage: 'Type message',
    })
  })
})

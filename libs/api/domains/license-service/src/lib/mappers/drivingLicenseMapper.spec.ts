import { DrivingLicensePayloadMapper } from './drivingLicenseMapper'
import { IntlService } from '@island.is/cms-translations'
import { m } from '../messages'
import {
  GenericLicenseDataFieldType,
  GenericUserLicenseMetaLinksType,
} from '../licenceService.type'
import { DriversLicenseWithExtras } from '@island.is/clients/license-client'

const formatMessage = (
  descriptor: { defaultMessage?: string },
  values?: Record<string, unknown>,
) => {
  let message = descriptor.defaultMessage ?? ''
  if (values) {
    Object.entries(values).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, String(value))
    })
  }
  return message
}

const createIntlService = () =>
  ({
    useIntl: jest.fn().mockResolvedValue({ formatMessage }),
  } as unknown as IntlService)

const baseLicense: DriversLicenseWithExtras = {
  id: 123,
  name: 'Jón Jónsson',
  socialSecurityNumber: '1234567890',
  publishDate: new Date('2020-01-01'),
  dateValidTo: new Date('2030-01-01'),
  categories: [],
  comments: [],
  temporaryLicense: false,
  publishPlaceNr: 1,
}

describe('DrivingLicensePayloadMapper', () => {
  let mapper: DrivingLicensePayloadMapper

  beforeEach(() => {
    mapper = new DrivingLicensePayloadMapper(createIntlService())
  })

  const findEntry = <T extends { label?: string }>(data: Array<T>, label: string) =>
    data.find((entry) => entry.label === label)

  type ValueEntry = {
    label?: string
    value?: string
    type: GenericLicenseDataFieldType
    tag?: {
      text: string
      color: string
      icon?: unknown
      iconColor?: unknown
      iconText?: string
    }
    link?: {
      label?: string
      value?: string
      type: GenericUserLicenseMetaLinksType
    }
  }

  it('includes penalty points and replaces the validTo tag with the deprivation tag when active', async () => {
    const license: DriversLicenseWithExtras = {
      ...baseLicense,
      totalPenaltyPoints: 4,
      hasActiveDeprivation: true,
    }

    const result = await mapper.parsePayload([license], 'is')
    const data = result[0].payload.data as Array<ValueEntry>

    const penaltyPointsEntry = findEntry(data, formatMessage(m.penaltyPoints))
    expect(penaltyPointsEntry?.value).toBe('4')
    expect(penaltyPointsEntry?.link).toEqual({
      label: formatMessage(m.viewPenaltyPoints),
      value: '/log-og-reglur/punktastada',
      type: GenericUserLicenseMetaLinksType.External,
    })

    const validToEntry = findEntry(data, formatMessage(m.validTo))
    expect(validToEntry?.tag?.text).toBe(formatMessage(m.activeDeprivationTag))
    expect(validToEntry?.tag?.color).toBe('red')
    // LicenseDataFields.tsx reads tag.iconText (not tag.text) for the
    // visible label, and tag.icon/tag.iconColor to render the icon.
    expect(validToEntry?.tag?.iconText).toBe(
      formatMessage(m.activeDeprivationTag),
    )
    expect(validToEntry?.tag?.icon).toBeDefined()
    expect(validToEntry?.tag?.iconColor).toBeDefined()
    expect(validToEntry?.link).toEqual({
      label: formatMessage(m.viewDeprivationDetails),
      value: '/log-og-reglur/sviptingar',
      type: GenericUserLicenseMetaLinksType.External,
    })
  })

  it('uses the normal expiry tag on validTo when hasActiveDeprivation is false', async () => {
    const license: DriversLicenseWithExtras = {
      ...baseLicense,
      totalPenaltyPoints: 2,
      hasActiveDeprivation: false,
    }

    const result = await mapper.parsePayload([license], 'is')
    const data = result[0].payload.data as Array<ValueEntry>

    const validToEntry = findEntry(data, formatMessage(m.validTo))
    expect(validToEntry?.tag?.text).not.toBe(
      formatMessage(m.activeDeprivationTag),
    )
    expect(validToEntry?.tag?.text).toBe(formatMessage(m.valid))
    expect(validToEntry?.link).toEqual({
      label: formatMessage(m.viewDeprivationDetails),
      value: '/log-og-reglur/sviptingar',
      type: GenericUserLicenseMetaLinksType.External,
    })
  })

  it('uses the normal expiry tag on validTo when hasActiveDeprivation is undefined', async () => {
    const license: DriversLicenseWithExtras = {
      ...baseLicense,
      totalPenaltyPoints: 2,
      hasActiveDeprivation: undefined,
    }

    const result = await mapper.parsePayload([license], 'is')
    const data = result[0].payload.data as Array<ValueEntry>

    const validToEntry = findEntry(data, formatMessage(m.validTo))
    expect(validToEntry?.tag?.text).not.toBe(
      formatMessage(m.activeDeprivationTag),
    )
    expect(validToEntry?.tag?.text).toBe(formatMessage(m.valid))
  })

  it('renders "0" penalty points when totalPenaltyPoints is undefined', async () => {
    const license: DriversLicenseWithExtras = {
      ...baseLicense,
      totalPenaltyPoints: undefined,
      hasActiveDeprivation: undefined,
    }

    const result = await mapper.parsePayload([license], 'is')
    const data = result[0].payload.data as Array<ValueEntry>

    const penaltyPointsEntry = findEntry(data, formatMessage(m.penaltyPoints))
    expect(penaltyPointsEntry?.value).toBe('0')
    expect(penaltyPointsEntry?.link).toEqual({
      label: formatMessage(m.viewPenaltyPoints),
      value: '/log-og-reglur/punktastada',
      type: GenericUserLicenseMetaLinksType.External,
    })
  })
})

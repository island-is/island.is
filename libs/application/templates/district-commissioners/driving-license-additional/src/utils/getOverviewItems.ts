import {
  Application,
  ExternalData,
  FormatMessage,
  FormValue,
  KeyValueItem,
  StaticText,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { NationalRegistryUser } from '@island.is/api/schema'
import { Jurisdiction } from '@island.is/clients/driving-license'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { format as formatNationalId } from 'kennitala'
import { m } from '../lib/messages'
import { advancedLicenseMap, B_ADVANCED, BE, Pickup } from './constants'
import { formatRegisteredAddress, getCodes } from './formUtils'

// Builds the "Réttindi sem sótt er um" line(s) shown at the top of the overview:
// a single label for BE, or a nested list of the selected advanced categories
// (main + professional) for B-advanced.
export const getOverviewSubTypeText = (
  application: Application,
  formatMessage?: FormatMessage,
): string => {
  if (typeof formatMessage !== 'function') {
    return ''
  }

  const applicationFor = getValueViaPath<string>(
    application.answers,
    'applicationFor',
  )

  if (applicationFor === BE) {
    return `- ${formatMessage(m.applicationForBELicenseTitle)}`
  }

  if (applicationFor === B_ADVANCED) {
    const selected =
      getValueViaPath<string[]>(application.answers, 'advancedLicense') ?? []

    const labelFor = (code: string) =>
      formatMessage(
        getValueViaPath<StaticText>(
          m,
          `applicationForAdvancedLicenseTitle${code}`,
        ) ??
          getValueViaPath<StaticText>(
            m,
            `applicationForAdvancedLicenseLabel${code}`,
          ) ??
          '',
      )

    const lines: string[] = []
    advancedLicenseMap.forEach((item) => {
      const proCode = item.professional?.code
      if (selected.includes(item.code)) {
        lines.push(`- **${labelFor(item.code)}**`)
        if (proCode && selected.includes(proCode)) {
          lines.push(`  - ${labelFor(proCode)}`)
        }
      } else if (proCode && selected.includes(proCode)) {
        lines.push(`- **${labelFor(proCode)}**`)
      }
    })

    return lines.join('\n')
  }

  return `- ${formatMessage(m.applicationForFullLicenseTitle)}`
}

export const getApplicantOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => [
  {
    width: 'half',
    keyText: m.overviewName,
    valueText:
      getValueViaPath<string>(externalData, 'nationalRegistry.data.fullName') ??
      '',
  },
  {
    width: 'half',
    keyText: m.overviewNationalId,
    valueText: formatNationalId(
      getValueViaPath<string>(
        externalData,
        'nationalRegistry.data.nationalId',
      ) ?? '',
    ),
  },
  {
    width: 'half',
    keyText: m.overviewPhoneNumber,
    hideIfEmpty: true,
    valueText: (() => {
      const phone = getValueViaPath<string>(answers, 'applicant.phoneNumber')
      return phone ? formatPhoneNumber(removeCountryCode(phone)) : ''
    })(),
  },
  {
    width: 'half',
    keyText: m.overviewEmail,
    hideIfEmpty: true,
    valueText: getValueViaPath<string>(answers, 'applicant.email') ?? '',
  },
  {
    width: 'half',
    keyText: m.overviewStreetAddress,
    valueText: formatRegisteredAddress(
      getValueViaPath<NationalRegistryUser['address']>(
        externalData,
        'nationalRegistry.data.address',
      ),
    ),
  },
]

export const getHealthCertificateOverviewItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const files =
    getValueViaPath<Array<{ name: string }>>(answers, 'healthCertificate') ?? []
  return [
    {
      width: 'full',
      keyText: m.overviewHealthCertificateUploaded,
      valueText: files.map((file) => file.name).join(', '),
    },
  ]
}

export const getPickupOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  if (getValueViaPath(answers, 'delivery.deliveryMethod') === Pickup.POST) {
    return [
      {
        width: 'full',
        keyText: m.pickupLocationTitle,
        valueText: m.overviewPickupPost,
      },
    ]
  }

  const jurisdictionId = getValueViaPath(answers, 'delivery.jurisdiction')
  const jurisdiction = getValueViaPath<Jurisdiction[]>(
    externalData,
    'jurisdictions.data',
  )?.find(({ id }) => `${id}` === `${jurisdictionId}`)

  return [
    {
      width: 'full',
      keyText: m.pickupLocationTitle,
      valueText: {
        ...m.overviewPickupDistrictWithLocation,
        values: { location: jurisdiction?.name ?? '' },
      },
    },
  ]
}

export const getPaymentOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const label =
    getValueViaPath(answers, 'delivery.deliveryMethod') === Pickup.POST
      ? m.overviewPaymentChargeWithDelivery
      : m.overviewPaymentCharge

  // getCodes throws when applicationFor is unset; guard so a partial/corrupt
  // answer state degrades to a blank price instead of crashing the summary.
  if (!getValueViaPath(answers, 'applicationFor')) {
    return [{ width: 'full', keyText: label, valueText: '' }]
  }

  const priceItems =
    getValueViaPath<{ priceAmount: number; chargeItemCode: string }[]>(
      externalData,
      'payment.data',
    ) ?? []

  // Derive the total from the same charge codes that are actually billed
  // (getCodes), so the displayed price can't drift from it.
  const prices = getCodes({ answers, externalData } as Application).map(
    ({ code }) =>
      priceItems.find(({ chargeItemCode }) => chargeItemCode === code)
        ?.priceAmount,
  )

  // If the payment catalog hasn't fully loaded, some expected codes have no
  // price. Show blank rather than a misleading partial/zero total until every
  // billable code is priced.
  if (prices.some((price) => price == null)) {
    return [{ width: 'full', keyText: label, valueText: '' }]
  }

  const total = prices.reduce<number>((sum, price) => sum + (price ?? 0), 0)

  return [
    {
      width: 'full',
      keyText: label,
      valueText: total.toLocaleString('is-IS') + ' kr.',
    },
  ]
}

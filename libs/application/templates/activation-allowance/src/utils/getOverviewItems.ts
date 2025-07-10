import { ExternalData, FormTextArray } from '@island.is/application/types'
import { FormValue } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { getValueViaPath } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import { applicant, paymentInformation } from '../lib/messages'
import { overview } from '../lib/messages/overview'
import { isSamePlaceOfResidenceChecked } from './isSamePlaceOfResidenceChecked'
import { contact } from '../lib/messages/contact'
import { isContactDifferentFromApplicant } from './isContactSameAsApplicant'
import { GaldurDomainModelsSettingsJobCodesJobCodeDTO } from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'

export const getApplicantOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: applicant.general.pageTitle,
      valueText: [
        getValueViaPath<string>(answers, 'applicant.name') ?? '',
        formatKennitala(
          getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
        ),
        isSamePlaceOfResidenceChecked(answers)
          ? `${getValueViaPath<string>(
              answers,
              'applicant.other.address',
            )}, ${getValueViaPath<string>(
              answers,
              'applicant.other.postalCode',
            )}`
          : `${getValueViaPath<string>(
              answers,
              'applicant.address',
            )}, ${getValueViaPath<string>(
              answers,
              'applicant.postalCode',
            )} ${getValueViaPath<string>(answers, 'applicant.city')}`,
        {
          ...overview.labels.phoneNumber,
          values: {
            value:
              getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
          },
        },
        getValueViaPath<string>(answers, 'applicant.email') ?? '',
      ],
    },
  ]
}

export const getPaymentOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const bankNumber =
    getValueViaPath<string>(answers, 'paymentInformation.bankNumber') ?? ''
  const ledger =
    getValueViaPath<string>(answers, 'paymentInformation.ledger') ?? ''
  const accountNumber =
    getValueViaPath<string>(answers, 'paymentInformation.accountNumber') ?? ''
  const value = `${bankNumber}-${ledger}-${accountNumber}`
  return [
    {
      width: 'full',
      keyText: paymentInformation.general.pageTitle,
      valueText: [
        {
          ...overview.labels.bank,
          values: {
            value: value,
          },
        },
      ],
    },
  ]
}

export const getContactOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const isDifferent = isContactDifferentFromApplicant(answers)
  let valueText: FormTextArray = []
  if (isDifferent) {
    valueText = [
      {
        ...overview.labels.name,
        values: {
          value: getValueViaPath<string>(answers, 'contact.name') ?? '',
        },
      },
      {
        ...overview.labels.contactConnection,
        values: {
          value: getValueViaPath<string>(answers, 'contact.connection') ?? '',
        },
      },
      {
        ...overview.labels.email,
        values: {
          value: getValueViaPath<string>(answers, 'contact.email') ?? '',
        },
      },
      {
        ...overview.labels.phoneNumber,
        values: {
          value: getValueViaPath<string>(answers, 'contact.phone') ?? '',
        },
      },
    ]
  } else {
    valueText = [
      {
        ...overview.labels.contactIsSameAsApplicant,
      },
    ]
  }

  return [
    {
      width: 'full',
      keyText: contact.general.pageTitle,
      valueText: valueText,
    },
  ]
}

export const useGetJobWishesOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
  _userNationalId: string,
  locale: Locale,
): Array<KeyValueItem> => {
  console.log('LOCALE', locale)

  const jobWishes = getValueViaPath<Array<string>>(answers, 'jobWishes.jobs')
  const escoJobs = getValueViaPath<
    GaldurDomainModelsSettingsJobCodesJobCodeDTO[]
  >(
    externalData,
    'activityGrantApplication.data.activationGrant.supportData.jobCodes',
  )
  const jobWishSet = new Set(jobWishes)

  const matchedJobs = (escoJobs ?? []).filter((job) => {
    if (!job.id) return false
    return jobWishSet.has(job.id)
  })

  return [
    {
      width: 'full',
      keyText: paymentInformation.general.pageTitle,
      valueText: [],
    },
  ]
}

export const getOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: 'Full width',
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText:
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText: 'Hvassaleiti 5',
    },
    {
      width: 'full',
      // empty item to end line
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'test@test.is',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'full',
      // empty item to end line
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'Reykjavík',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText: 'test@test.is',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'test@test.is',
    },
  ]
}

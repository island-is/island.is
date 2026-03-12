import { ExternalData, FormText, FormValue } from '@island.is/application/types'
import { m } from '../lib/messages/messages'
import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { Applicant, FormerInsurance, Status } from './types'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { EmploymentStatus } from './constants'
import { m as cm, messagesCountries } from '../lib/messages/countries'

export const applicantOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  _locale: string,
) => {
  const applicant = getValueViaPath<Applicant>(answers, 'applicant')
  return [
    {
      width: 'half' as const,
      keyText: m.name,
      valueText: applicant?.name ?? '',
    },
    {
      width: 'half' as const,
      keyText: m.nationalId,
      valueText: applicant?.nationalId ?? '',
    },
    {
      width: 'half' as const,
      keyText: m.address,
      valueText: applicant?.address ?? '',
    },
    {
      width: 'half' as const,
      keyText: m.postalCode,
      valueText: applicant?.postalCode ?? '',
    },
    {
      width: 'full' as const,
      keyText: m.city,
      valueText: applicant?.city,
    },
  ]
}

export const emailPhonOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  _locale: string,
) => {
  const applicant = getValueViaPath<Applicant>(answers, 'applicant')
  return [
    {
      width: 'half' as const,
      keyText: m.email,
      valueText: applicant?.email ?? '',
    },
    {
      width: 'half' as const,
      keyText: m.phoneNumber,
      valueText: formatPhoneNumber(applicant?.phoneNumber ?? ''),
    },
  ]
}

const statusTypeToMessage = {
  [EmploymentStatus.EMPLOYED]: m.statusEmployed,
  [EmploymentStatus.STUDENT]: m.statusStudent,
  [EmploymentStatus.PENSIONER]: m.statusPensioner,
  [EmploymentStatus.OTHER]: m.statusOther,
}

export const statusAndChildrenOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  _locale: string,
) => {
  const status = getValueViaPath<Status>(answers, 'status')
  const children = getValueViaPath<YesOrNo>(answers, 'children')
  return [
    {
      width: 'full' as const,
      keyText: m.statusDescription,
      valueText: status?.type ? statusTypeToMessage[status.type] ?? '' : '',
    },
    {
      width: 'full' as const,
      keyText: m.childrenDescription,
      valueText: children === YES ? m.yesOptionLabel : m.noOptionLabel,
    },
  ]
}

export const statusAttachmentsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
) => {
  const files = getValueViaPath<Array<File>>(
    answers,
    'status.confirmationOfStudies',
  )

  if (!files) return []

  return (
    files?.map((file) => ({
      width: 'full' as const,
      fileName: file.name,
      fileType: file.name.split('.').pop()?.toUpperCase() ?? undefined,
    })) ?? []
  )
}

// helper at the top of the file
const getCountryMessage = (countryJson: string | undefined): FormText => {
  if (!countryJson) return ''
  try {
    const { name } = JSON.parse(countryJson) as {
      name: string
      countryCode: string
    }
    if (name in messagesCountries) {
      return cm[name as keyof typeof cm]
    }
    return name
  } catch {
    return countryJson
  }
}

export const formerInsuranceOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  _locale: string,
) => {
  const formerInsurance = getValueViaPath<FormerInsurance>(
    answers,
    'formerInsurance',
  )
  if (!formerInsurance) return []

  const {
    registration,
    country,
    personalId,
    institution,
    entitlement,
    entitlementReason,
  } = formerInsurance

  const explanation =
    entitlement === YES
      ? [
          {
            width: 'full' as const,
            keyText: m.explanation,
            valueText: entitlementReason,
          },
        ]
      : []

  return [
    {
      width: 'full' as const,
      keyText: m.formerInsuranceRegistration,
      valueText: registration === YES ? m.yesOptionLabel : m.noOptionLabel,
    },
    {
      width: 'full' as const,
      keyText: m.formerInsuranceCountry,
      valueText: getCountryMessage(country),
    },
    {
      width: 'half' as const,
      keyText: m.formerPersonalId,
      valueText: personalId,
    },
    {
      width: 'half' as const,
      keyText: m.formerInsuranceInstitution,
      valueText: institution,
    },
    {
      width: 'full' as const,
      keyText: m.formerInsuranceEntitlement,
      valueText: entitlement === YES ? m.yesOptionLabel : m.noOptionLabel,
    },
    ...explanation,
  ]
}

export const formerInsuranceAttachmentsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
) => {
  const confirmationOfResidencyDocument = getValueViaPath<Array<File>>(
    answers,
    'formerInsurance.confirmationOfResidencyDocument',
  )

  return (
    confirmationOfResidencyDocument?.map((file) => ({
      width: 'full' as const,
      fileName: file.name,
      fileType: file.name.split('.').pop()?.toUpperCase() ?? undefined,
    })) ?? []
  )
}

export const extraInformationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
  _userNationalId: string,
  _locale: string,
) => {
  const additionalRemarks = getValueViaPath<string>(
    answers,
    'additionalRemarks',
  )

  return [
    {
      width: 'full' as const,
      keyText: m.extraInformationSectionTitle,
      valueText: additionalRemarks,
    },
  ]
}

export const extraInformationAttachmentsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
) => {
  const additionalFiles = getValueViaPath<Array<File>>(
    answers,
    'additionalFiles',
  )

  return (
    additionalFiles?.map((file) => ({
      width: 'full' as const,
      fileName: file.name,
      fileType: file.name.split('.').pop()?.toUpperCase() ?? undefined,
    })) ?? []
  )
}

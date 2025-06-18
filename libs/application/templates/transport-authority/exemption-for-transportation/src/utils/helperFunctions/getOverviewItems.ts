import {
  AttachmentItem,
  ExternalData,
  FormText,
} from '@island.is/application/types'
import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import { exemptionPeriod, location, overview } from '../../lib/messages'
import { formatDateStr } from './format'
import { shouldShowResponsiblePerson } from './shouldShowResponsiblePerson'
import { isSameAsApplicant } from './isSameAsApplicant'
import { checkIfExemptionTypeShortTerm } from './getExemptionType'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'

export const getUserInformationOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const getApplicant = (includeAddress: boolean) => [
    getValueViaPath<string>(externalData, 'nationalRegistry.data.fullName'),
    formatKennitala(
      getValueViaPath<string>(
        externalData,
        'nationalRegistry.data.nationalId',
      ) || '',
    ),
    ...(includeAddress
      ? [
          `${getValueViaPath<string>(
            externalData,
            'nationalRegistry.data.address.streetAddress',
          )}, ${
            getValueViaPath<string>(
              externalData,
              'nationalRegistry.data.address.postalCode',
            ) ?? ''
          } ${
            getValueViaPath<string>(
              externalData,
              'nationalRegistry.data.address.locality',
            ) ?? ''
          }`,
        ]
      : []),
    formatPhoneNumber(
      getValueViaPath<string>(answers, 'applicant.phoneNumber') || '',
    ),
    getValueViaPath<string>(answers, 'applicant.email'),
  ]

  const transporter = [
    getValueViaPath<string>(answers, 'transporter.name'),
    formatKennitala(
      getValueViaPath<string>(answers, 'transporter.nationalId') || '',
    ),
    `${getValueViaPath<string>(
      answers,
      'transporter.address',
    )}, ${getValueViaPath<string>(answers, 'transporter.postalCodeAndCity')}`,
    formatPhoneNumber(
      getValueViaPath<string>(answers, 'transporter.phone') || '',
    ),
    getValueViaPath<string>(answers, 'transporter.email'),
  ]

  const responsiblePerson = [
    getValueViaPath<string>(answers, 'responsiblePerson.name'),
    formatKennitala(
      getValueViaPath<string>(answers, 'responsiblePerson.nationalId') || '',
    ),
    formatPhoneNumber(
      getValueViaPath<string>(answers, 'responsiblePerson.phone') || '',
    ),
    getValueViaPath<string>(answers, 'responsiblePerson.email'),
  ]

  return [
    {
      width: 'half',
      keyText: overview.userInformation.applicantSubtitle,
      valueText: getApplicant(false),
    },
    {
      width: 'half',
      keyText: overview.userInformation.transporterSubtitle,
      valueText: isSameAsApplicant(answers, 'transporter')
        ? getApplicant(true)
        : transporter,
    },
    {
      width: 'half',
      keyText: overview.userInformation.responsiblePersonSubtitle,
      valueText: shouldShowResponsiblePerson(answers)
        ? isSameAsApplicant(answers, 'responsiblePerson')
          ? getApplicant(false)
          : responsiblePerson
        : '',
      hideIfEmpty: true,
    },
  ]
}

export const getExemptionPeriodOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: [
        overview.exemptionPeriod.type,
        overview.exemptionPeriod.dateFrom,
        overview.exemptionPeriod.dateTo,
      ],
      inlineKeyText: true,
      valueText: [
        checkIfExemptionTypeShortTerm(answers)
          ? exemptionPeriod.type.shortTermOptionTitle
          : exemptionPeriod.type.longTermOptionTitle,
        formatDateStr(
          getValueViaPath<string>(answers, 'exemptionPeriod.dateFrom'),
        ),
        formatDateStr(
          getValueViaPath<string>(answers, 'exemptionPeriod.dateTo'),
        ),
      ],
    },
  ]
}

export const getShortTermLocationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: [
        overview.shortTermlocation.from,
        overview.shortTermlocation.to,
        overview.shortTermlocation.directions,
      ],
      inlineKeyText: true,
      valueText: [
        `${getValueViaPath<string>(
          answers,
          'location.shortTerm.addressFrom',
        )}, ${getValueViaPath<string>(
          answers,
          'location.shortTerm.postalCodeAndCityFrom',
        )}`,
        `${getValueViaPath<string>(
          answers,
          'location.shortTerm.addressTo',
        )}, ${getValueViaPath<string>(
          answers,
          'location.shortTerm.postalCodeAndCityTo',
        )}`,
        getValueViaPath<string>(answers, 'location.shortTerm.directions'),
      ],
    },
  ]
}

export const getLongTermLocationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const regions = getValueViaPath<string[]>(
    answers,
    'location.longTerm.regions',
  )?.map((key) => getValueViaPath<FormText[]>(location.regionOptions, key))
  const directions = getValueViaPath<string>(
    answers,
    'location.longTerm.directions',
  )

  return [
    {
      width: 'full',
      keyText: [
        regions ? overview.longTermlocation.regions : '',
        directions ? overview.longTermlocation.directions : '',
      ].filter((x) => !!x),
      inlineKeyText: true,
      valueText: [regions, directions].filter((x) => !!x),
    },
  ]
}

const getFileType = (fileName: string): string | undefined => {
  return fileName.split('.').pop()?.toUpperCase()
}

export const getLongTermLocationOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const files = getValueViaPath<{ name: string; key: string }[]>(
    answers,
    'location.longTerm.files',
  )

  return (
    files?.map((x) => ({
      width: 'full',
      fileName: x.name,
      fileType: getFileType(x.name),
    })) || []
  )
}

export const getSupportingDocumentsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: overview.supportingDocuments.comments,
      valueText: getValueViaPath<string>(
        answers,
        'supportingDocuments.comments',
      ),
      hideIfEmpty: true,
    },
  ]
}

export const getSupportingDocumentsOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const files = getValueViaPath<{ name: string; key: string }[]>(
    answers,
    'supportingDocuments.files',
  )

  return (
    files?.map((x) => ({
      width: 'full',
      fileName: x.name,
      fileType: getFileType(x.name),
    })) || []
  )
}

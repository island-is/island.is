import { coreMessages, YES } from '@island.is/application/core'
import {
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { formatNumber } from 'libphonenumber-js'
import { license as licenseMessages, overview } from '../lib/messages'
import { formatAddress, getLegalDomicile } from './address'
import { DeliveryMethod } from './constants'
import { getApplicationAnswers } from './getApplicationAnswers'
import { getApplicationExternalData } from './getApplicationExternalData'
import { formatRightName } from './machineLicenseRights'

const withValue = (
  message: typeof overview.labels[keyof typeof overview.labels],
  value?: string,
) => ({ ...message, values: { value: value ?? '' } })

export const getApplicantOverviewItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    applicantEmail,
    applicantPhoneNumber,
  } = getApplicationAnswers(answers)

  return [
    {
      width: 'full',
      keyText: overview.labels.applicant,
      valueText: [
        withValue(overview.labels.name, applicantName),
        withValue(
          overview.labels.nationalId,
          applicantNationalId && formatKennitala(applicantNationalId),
        ),
        withValue(
          overview.labels.legalDomicile,
          formatAddress(applicantAddress, applicantPostalCode, applicantCity),
        ),
        withValue(overview.labels.email, applicantEmail),
        withValue(
          overview.labels.phoneNumber,
          applicantPhoneNumber &&
            (formatNumber(applicantPhoneNumber, 'IS', 'INTERNATIONAL') ||
              applicantPhoneNumber),
        ),
      ],
    },
  ]
}

export const getRightsOverviewItems = (
  _answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const { machineLicenseRights } = getApplicationExternalData(externalData)

  return [
    {
      width: 'full',
      keyText: overview.labels.rights,
      valueText: [
        withValue(
          overview.labels.licenseNumber,
          machineLicenseRights?.licenseNumber,
        ),
        ...(machineLicenseRights?.renewableRights ?? []).map(formatRightName),
      ],
    },
  ]
}

export const getMedicalCertificateAttachments = (
  answers: FormValue,
): Array<AttachmentItem> =>
  getApplicationAnswers(answers).medicalCertificate.map((file) => ({
    width: 'full',
    fileName: file.name,
    fileType: file.name.split('.').pop(),
  }))

export const getLicenseOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    plasticCard,
    deliveryMethod,
    deliveryAddress,
    deliveryPostalCodeAndCity,
    deliveryRecipient,
  } = getApplicationAnswers(answers)

  const items: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: overview.labels.plasticCard,
      valueText:
        plasticCard === YES ? coreMessages.radioYes : coreMessages.radioNo,
    },
  ]

  if (plasticCard !== YES) {
    return items
  }

  items.push({
    width: 'full',
    keyText: overview.labels.deliveryMethod,
    valueText:
      deliveryMethod === DeliveryMethod.OTHER_ADDRESS
        ? [
            [deliveryAddress, deliveryPostalCodeAndCity]
              .filter(Boolean)
              .join(', '),
            deliveryRecipient
              ? withValue(overview.labels.recipient, deliveryRecipient)
              : null,
          ].filter((x) => x !== null)
        : {
            ...licenseMessages.labels.legalDomicile,
            values: { address: getLegalDomicile(externalData) },
          },
  })

  return items
}

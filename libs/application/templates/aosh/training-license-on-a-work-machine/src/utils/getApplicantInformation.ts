import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { information } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './formatPhoneNumber'

export const getApplicantInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const applicantNationalId = getValueViaPath<string>(
    answers,
    'information.nationalId',
  )
  const applicantName = getValueViaPath<string>(answers, 'information.name')
  const applicantAddress = getValueViaPath<string>(
    answers,
    'information.address',
  )
  const applicantPostCode = getValueViaPath<string>(
    answers,
    'information.postCode',
  )
  const applicantEmail = getValueViaPath<string>(answers, 'information.email')
  const applicantPhone = getValueViaPath<string>(answers, 'information.phone')
  const machineLicenseNumber = getValueViaPath<string>(
    answers,
    'information.machineLicenseNumber',
  )
  const driversLicenseNumber = getValueViaPath<string>(
    answers,
    'information.driversLicenseNumber',
  )
  const driversLicenseDate = getValueViaPath<string>(
    answers,
    'information.driversLicenseDate',
  )

  return [
    `${formatMessage(information.labels.name)}: ${applicantName}`,
    `${formatMessage(information.labels.nationalId)}: ${formatKennitala(
      applicantNationalId ?? '',
    )}`,
    `${formatMessage(information.labels.address)}: ${applicantAddress}`,
    `${formatMessage(information.labels.postCode)}: ${applicantPostCode}`,
    `${formatMessage(information.labels.email)}: ${applicantEmail}`,
    `${formatMessage(information.labels.phone)}: ${formatPhoneNumber(
      applicantPhone ?? '',
    )}`,
    `${formatMessage(
      information.labels.machineLicenseNumber,
    )}: ${machineLicenseNumber}`,
    `${formatMessage(
      information.labels.driversLicenseNumber,
    )}: ${driversLicenseNumber}`,
    `${formatMessage(
      information.labels.driversLicenseDate,
    )}: ${driversLicenseDate}`,
  ].filter((n) => n)
}

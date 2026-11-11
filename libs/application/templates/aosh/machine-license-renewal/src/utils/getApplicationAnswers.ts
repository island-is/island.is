import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { MachineLicenseRenewalAnswers } from '../lib/dataSchema'

type License = MachineLicenseRenewalAnswers['license']

export const getApplicationAnswers = (answers: Application['answers']) => {
  const applicantName = getValueViaPath<string>(answers, 'applicant.name')

  const applicantNationalId = getValueViaPath<string>(
    answers,
    'applicant.nationalId',
  )

  const applicantAddress = getValueViaPath<string>(answers, 'applicant.address')

  const applicantPostalCode = getValueViaPath<string>(
    answers,
    'applicant.postalCode',
  )

  const applicantCity = getValueViaPath<string>(answers, 'applicant.city')

  const applicantEmail = getValueViaPath<string>(answers, 'applicant.email')

  const applicantPhoneNumber = getValueViaPath<string>(
    answers,
    'applicant.phoneNumber',
  )

  const medicalCertificate =
    getValueViaPath<MachineLicenseRenewalAnswers['medicalCertificate']>(
      answers,
      'medicalCertificate',
    ) ?? []

  const plasticCard = getValueViaPath<License['plasticCard']>(
    answers,
    'license.plasticCard',
  )

  const deliveryMethod = getValueViaPath<License['deliveryMethod']>(
    answers,
    'license.deliveryMethod',
  )

  const deliveryAddress = getValueViaPath<string>(answers, 'license.address')

  const deliveryPostalCodeAndCity = getValueViaPath<string>(
    answers,
    'license.postalCodeAndCity',
  )

  const deliveryRecipient = getValueViaPath<string>(
    answers,
    'license.recipient',
  )

  return {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantPostalCode,
    applicantCity,
    applicantEmail,
    applicantPhoneNumber,
    medicalCertificate,
    plasticCard,
    deliveryMethod,
    deliveryAddress,
    deliveryPostalCodeAndCity,
    deliveryRecipient,
  }
}

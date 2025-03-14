import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { PaymentArrangementType } from '../shared/types'
import { IndividualOrCompany, PaymentOptions } from '../shared/constants'
import { paymentArrangement } from '../lib/messages'
import { formatPhoneNumber } from './formatPhoneNumber'
import { isApplyingForMultiple } from './isApplyingForMultiple'

export const getPaymentArrangementForOverview = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const paymentArrangementAnswers = getValueViaPath<PaymentArrangementType>(
    answers,
    'paymentArrangement',
  )

  const userIsApplyingForMultiple = isApplyingForMultiple(answers)

  const applicantEmail = getValueViaPath<string>(answers, 'applicant.email')

  const applicantPhone = getValueViaPath<string>(
    answers,
    'applicant.phoneNumber',
  )

  return !userIsApplyingForMultiple ||
    paymentArrangementAnswers?.individualOrCompany ===
      IndividualOrCompany.individual
    ? [
        `${formatMessage(paymentArrangement.labels.cashOnDelivery)}`,
        `${formatMessage(paymentArrangement.labels.email)}: ${
          !userIsApplyingForMultiple
            ? applicantEmail
            : paymentArrangementAnswers?.individualInfo?.email
        }`,
        `${formatMessage(paymentArrangement.labels.phonenumber)}: ${
          !userIsApplyingForMultiple
            ? formatPhoneNumber(applicantPhone ?? '')
            : formatPhoneNumber(
                paymentArrangementAnswers?.individualInfo?.phone ?? '',
              )
        }`,
      ]
    : [
        `${
          paymentArrangementAnswers?.paymentOptions ===
          PaymentOptions.cashOnDelivery
            ? formatMessage(paymentArrangement.labels.cashOnDelivery)
            : formatMessage(paymentArrangement.labels.putIntoAccount)
        }`,
        `${paymentArrangementAnswers?.companyInfo?.name}, ${formatKennitala(
          paymentArrangementAnswers?.companyInfo?.nationalId ?? '',
        )}`,
        `${formatMessage(paymentArrangement.labels.contactEmail)}: ${
          paymentArrangementAnswers?.contactInfo?.email
        }`,
        `${formatMessage(
          paymentArrangement.labels.contactPhone,
        )}: ${formatPhoneNumber(
          paymentArrangementAnswers?.contactInfo?.phone ?? '',
        )}`,
        paymentArrangementAnswers?.explanation
          ? `${formatMessage(paymentArrangement.labels.explanation)}: ${
              paymentArrangementAnswers?.explanation
            }`
          : '',
      ].filter((n) => n)
}

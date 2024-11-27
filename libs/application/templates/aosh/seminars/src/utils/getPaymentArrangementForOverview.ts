import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormatMessage,
  FormValue,
} from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { PaymentArrangementType } from '../lib/dataSchema'
import { IndividualOrCompany, PaymentOptions } from '../shared/contstants'
import { paymentArrangement } from '../lib/messages'

export const getPaymentArrangementForOverview = (
  answers: FormValue,
  externalData: ExternalData,
  formatMessage: FormatMessage,
) => {
  const paymentArrangementAnswers = getValueViaPath<PaymentArrangementType>(
    answers,
    'paymentArrangement',
  )

  return paymentArrangementAnswers?.individualOrCompany ===
    IndividualOrCompany.individual
    ? [
        `${formatMessage(paymentArrangement.labels.cashOnDelivery)}`,
        `${formatMessage(paymentArrangement.labels.email)}: ${
          paymentArrangementAnswers?.individualInfo?.email
        }`,
        `${formatMessage(paymentArrangement.labels.phonenumber)}: ${
          paymentArrangementAnswers?.individualInfo?.phone
        }`,
      ]
    : [
        `${
          paymentArrangementAnswers?.paymentOptions ===
          PaymentOptions.cashOnDelivery
            ? formatMessage(paymentArrangement.labels.cashOnDelivery)
            : formatMessage(paymentArrangement.labels.putIntoAccount)
        }`,
        `${paymentArrangementAnswers?.companyInfo?.label}, ${formatKennitala(
          paymentArrangementAnswers?.companyInfo?.nationalId ?? '',
        )}`,
        `${formatMessage(paymentArrangement.labels.contactEmail)}: ${
          paymentArrangementAnswers?.contactInfo?.email
        }`,
        `${formatMessage(paymentArrangement.labels.contactPhone)}: ${
          paymentArrangementAnswers?.contactInfo?.phone
        }`,
        paymentArrangementAnswers?.explanation
          ? `${formatMessage(paymentArrangement.labels.explanation)}: ${
              paymentArrangementAnswers?.explanation
            }`
          : '',
      ].filter((n) => n)
}

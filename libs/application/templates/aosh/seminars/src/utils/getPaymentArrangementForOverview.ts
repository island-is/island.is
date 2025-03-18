import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { PaymentArrangementType } from '../shared/types'
import { PaymentOptions } from '../shared/constants'
import { overview } from '../lib/messages'
import { formatPhoneNumber } from './formatPhoneNumber'
import { isApplyingForMultiple } from './isApplyingForMultiple'

export const getPaymentArrangementForOverviewMultiple = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const paymentArrangementAnswers = getValueViaPath<PaymentArrangementType>(
    answers,
    'paymentArrangement',
  )
  return [
    {
      width: 'full',
      valueText: [
        paymentArrangementAnswers?.paymentOptions ===
        PaymentOptions.cashOnDelivery
          ? overview.paymentArrangement.cashOnDelivery
          : overview.paymentArrangement.putIntoAccount,
        `${paymentArrangementAnswers?.companyInfo?.name}, ${formatKennitala(
          paymentArrangementAnswers?.companyInfo?.nationalId ?? '',
        )}`,
        {
          ...overview.paymentArrangement.contactEmail,
          values: {
            value: paymentArrangementAnswers?.contactInfo?.email,
          },
        },
        {
          ...overview.paymentArrangement.contactPhone,
          values: {
            value: formatPhoneNumber(
              paymentArrangementAnswers?.contactInfo?.phone ?? '',
            ),
          },
        },
        {
          ...overview.paymentArrangement.explanation,
          values: {
            value: paymentArrangementAnswers?.explanation,
          },
        },
      ],
    },
  ]
}

export const getPaymentArrangementForOverviewSingle = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
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
  return [
    {
      width: 'full',
      valueText: [
        overview.paymentArrangement.cashOnDelivery,
        {
          ...overview.paymentArrangement.email,
          values: {
            value: !userIsApplyingForMultiple
              ? applicantEmail
              : paymentArrangementAnswers?.individualInfo?.email,
          },
        },
        {
          ...overview.paymentArrangement.phonenumber,
          values: {
            value: !userIsApplyingForMultiple
              ? formatPhoneNumber(applicantPhone ?? '')
              : formatPhoneNumber(
                  paymentArrangementAnswers?.individualInfo?.phone ?? '',
                ),
          },
        },
      ],
    },
  ]
}

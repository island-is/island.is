import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { PaymentArrangementType, PaymentOptions } from '../shared/types'
import { overview } from '../lib/messages'
import { formatPhoneNumber } from './formatPhoneNumber'
import * as kennitala from 'kennitala'

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
        {
          ...overview.paymentArrangement.payer,
          values: {
            value: `${
              paymentArrangementAnswers?.companyInfo?.name
            }, ${formatKennitala(
              paymentArrangementAnswers?.companyInfo?.nationalId ?? '',
            )}`,
          },
        },
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
  const applicantNationalId = getValueViaPath<string>(
    answers,
    'applicant.nationalId',
  )
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
          ...overview.paymentArrangement.nationalId,
          values: {
            value: applicantNationalId && kennitala.format(applicantNationalId),
          },
        },
        {
          ...overview.paymentArrangement.phonenumber,
          values: {
            value: formatPhoneNumber(applicantPhone ?? ''),
          },
        },
      ],
    },
  ]
}

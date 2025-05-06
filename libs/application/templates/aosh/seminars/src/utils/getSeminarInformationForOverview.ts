import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
  PaymentCatalogItem,
} from '@island.is/application/types'
import { CourseDTO } from '@island.is/clients/seminars-ver'
import { formatIsk } from './formatIsk'
import { overview } from '../lib/messages'

export const getSeminarInformationForOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const seminar = getValueViaPath<CourseDTO>(_externalData, 'seminar.data')

  const paymentItem = getValueViaPath<Array<PaymentCatalogItem>>(
    _externalData,
    'payment.data',
  )?.filter(
    (item: PaymentCatalogItem) =>
      item.chargeItemCode === seminar?.feeCodeDirectPayment,
  )[0]
  return [
    {
      width: 'full',
      valueText: [
        `${seminar?.name ?? ''}`,
        `${formatIsk(paymentItem?.priceAmount ?? 0)}`,
        seminar?.alwaysOpen
          ? overview.seminarInfo.seminarBegins
          : `${seminar?.dateFrom ?? ''}`,
        seminar?.alwaysOpen
          ? overview.seminarInfo.seminarEnds
          : `${seminar?.dateTo ?? ''}`,
      ],
    },
  ]
}

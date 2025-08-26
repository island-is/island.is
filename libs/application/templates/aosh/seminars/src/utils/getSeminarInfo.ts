import { CourseDTO } from '@island.is/clients/seminars-ver'
import { seminar as seminarMessages } from '../lib/messages'
import { formatIsk } from './formatIsk'
import { PaymentCatalogItem } from '@island.is/application/types'

export const getSeminarInfo = (
  seminar?: CourseDTO,
  paymentItem?: PaymentCatalogItem,
) => {
  return [
    {
      label: seminarMessages.labels.seminarType,
      value: seminar?.name ?? '',
    },
    {
      label: seminarMessages.labels.seminarPrice,
      value: formatIsk(paymentItem?.priceAmount ?? 0),
    },
    {
      label: seminarMessages.labels.seminarBegins,
      value: seminar?.alwaysOpen
        ? seminarMessages.labels.seminarOpens
        : seminar?.dateFrom ?? '',
    },
    {
      label: seminarMessages.labels.seminarEnds,
      value: seminar?.alwaysOpen
        ? seminarMessages.labels.openForWeeks
        : seminar?.dateTo ?? '',
    },
    {
      label: '',
      value: '',
    },
    {
      label: seminarMessages.labels.seminarDescription,
      value: {
        ...seminarMessages.labels.seminarDescriptionUrlText,
        values: { url: seminar?.descriptionUrl },
      },
    },
    {
      label: seminarMessages.labels.seminarLocation,
      value: seminar?.location ?? '',
    },
  ]
}

import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormatMessage } from '@island.is/application/types'
import { CourseDTO } from '@island.is/clients/seminars-ver'
import { formatIsk } from './formatIsk'
import { seminar as seminarMessages } from '../lib/messages'

export const getSeminarInformationForOverview = (
  externalData: ExternalData,
  formatMessage: FormatMessage,
) => {
  const seminar = getValueViaPath<CourseDTO>(externalData, 'seminar.data')

  return [
    `${seminar?.name ?? ''}`,
    `${formatIsk(seminar?.price ?? 0)}`,
    `${
      seminar?.alwaysOpen
        ? `${formatMessage(
            seminarMessages.labels.seminarBegins,
          )} ${formatMessage(seminarMessages.labels.seminarOpens)}`
        : seminar?.dateFrom ?? ''
    }`,
    `${
      seminar?.alwaysOpen
        ? `${formatMessage(seminarMessages.labels.seminarEnds)} ${formatMessage(
            seminarMessages.labels.openForWeeks,
          )}`
        : seminar?.dateTo ?? ''
    }`,
  ].filter((n) => n)
}

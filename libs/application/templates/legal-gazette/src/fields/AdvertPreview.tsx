import { LGFieldBaseProps } from '../utils/types'
import { AdvertDisplay } from '../components/advert-display/AdvertDisplay'
import { ApplicationStatus } from '@island.is/application/types'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import is from 'date-fns/locale/is'
import { getValueViaPath } from '@island.is/application/core'
import { isWeekday } from '../utils/utils'
export const AdvertPreview = ({ application }: LGFieldBaseProps) => {
  const publicationDateAnswers = getValueViaPath<(string | undefined)[]>(
    application.answers,
    'publishing.publicationDate',
    [],
  )
  let firstPublicationDate =
    publicationDateAnswers?.find((date) => date !== undefined) ??
    addDays(new Date(), 14).toISOString()

  while (!isWeekday(new Date(firstPublicationDate))) {
    firstPublicationDate = addDays(
      new Date(firstPublicationDate),
      1,
    ).toISOString()
  }

  return (
    <AdvertDisplay
      status={
        application.status === ApplicationStatus.IN_PROGRESS
          ? 'Innsend'
          : undefined
      }
      publicationDate={format(new Date(firstPublicationDate), 'dd.MM.yyyy')}
      title={application.answers.application.caption}
      signatureDate={format(
        new Date(application.answers.signature.date),
        'dd. MMMM yyyy.',
        {
          locale: is,
        },
      )}
      signatureLocation={application.answers.signature.location}
      signatureName={application.answers.signature.name}
      html={Buffer.from(
        application.answers.application.html,
        'base64',
      ).toString('utf-8')}
    />
  )
}

export default AdvertPreview

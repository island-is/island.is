import { LGFieldBaseProps } from '../lib/types'
import { AdvertDisplay } from '../components/advert-display/AdvertDisplay'
import { ApplicationStatus } from '@island.is/application/types'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import is from 'date-fns/locale/is'
export const AdvertPreview = ({ application }: LGFieldBaseProps) => {
  const firstDate = application.answers.publishing.dates[0]

  const publicationDate = firstDate
    ? format(new Date(firstDate), 'dd.MM.yyyy')
    : format(addDays(new Date(), 14), 'dd.MM.yyyy')

  return (
    <AdvertDisplay
      status={
        application.status === ApplicationStatus.IN_PROGRESS
          ? 'Innsend'
          : undefined
      }
      publicationDate={publicationDate}
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

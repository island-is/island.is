import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import { GenericReview } from '../../components/GenericReview'
import { UniversityApplication } from '../../lib/dataSchema'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route?: Routes
}

export const OtherDocumentsReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as UniversityApplication
  const { formatMessage } = useLocale()

  return (
    <GenericReview
      application={application}
      leftColumnItems={[' TODO ']}
      leftDescription={formatMessage(review.labels.otherDocuments)}
      goToScreen={goToScreen}
      route={route}
    />
  )
}

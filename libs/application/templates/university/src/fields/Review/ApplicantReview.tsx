import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import * as kennitala from 'kennitala'
import { Routes } from '../../lib/constants'
import { GenericReview } from '../../components/GenericReview'
import { UniversityApplication } from '../../lib/dataSchema'
import { formatPhoneNumber } from '../../utils'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route?: Routes
}

export const ApplicantReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as UniversityApplication
  const { formatMessage } = useLocale()

  return (
    <GenericReview
      application={application}
      leftColumnItems={[
        answers?.userInformation?.name,
        kennitala.format(answers?.userInformation?.nationalId),
        `${answers?.userInformation?.address}, ${answers?.userInformation?.postalCode}`,
        `${formatMessage(review.labels.phoneLabel)}: ${formatPhoneNumber(
          answers?.userInformation?.phone,
        )}`,
        answers?.userInformation?.email,
      ]}
      leftDescription={formatMessage(review.labels.applicant)}
      goToScreen={goToScreen}
      route={route}
    />
  )
}

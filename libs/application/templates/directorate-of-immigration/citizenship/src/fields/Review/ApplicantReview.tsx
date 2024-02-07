import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { personal, review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'
import * as kennitala from 'kennitala'
import { Routes } from '../../lib/constants'
import { GenericReview } from '../../components/GenericReview'
import { formatPhoneNumber } from '../../utils'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const ApplicantReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as Citizenship
  const { formatMessage } = useLocale()

  return (
    <GenericReview
      application={application}
      leftColumnItems={[
        answers?.userInformation?.name,
        kennitala.format(answers?.userInformation?.nationalId),
        answers?.userInformation?.email,
        `${formatMessage(personal.labels.userInformation.citizenship)}: ${
          answers?.userInformation?.citizenship
        }`,
        `${formatMessage(personal.labels.userInformation.birthCountry)}: ${
          answers?.userInformation?.birthCountry || ''
        }`,
      ]}
      rightColumnItems={[
        answers?.userInformation?.address,
        answers?.userInformation?.postalCode,
        `${formatPhoneNumber(answers?.userInformation?.phone)}`,
        `${formatMessage(
          personal.labels.userInformation
            .residenceInIcelandLastChangeDateShorter,
        )}: ${answers?.userInformation?.residenceInIcelandLastChangeDateStr}`,
      ]}
      leftDescription={formatMessage(review.labels.applicant)}
      goToScreen={goToScreen}
      route={route}
    />
  )
}

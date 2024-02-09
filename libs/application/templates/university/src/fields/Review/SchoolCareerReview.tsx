import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { review } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Routes } from '../../lib/constants'
import { GenericReview } from '../../components/GenericReview'
import { EducationDetailsItem } from '../../shared/types'
import { formatDate } from '../../utils'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
  educationItem: EducationDetailsItem
}

export const SchoolCareerReview: FC<Props> = ({
  application,
  goToScreen,
  educationItem,
  route,
}) => {
  const { formatMessage } = useLocale()

  return (
    <GenericReview
      application={application}
      leftColumnItems={[
        educationItem.school,
        educationItem.degreeLevel,
        educationItem.degreeMajor || '',
        `${educationItem.finishedUnits} einingar`,
        `Hófst: ${formatDate(new Date(educationItem.beginningDate))}`,
        `Lauk: ${formatDate(new Date(educationItem.endDate))}`,
      ]}
      leftDescription={formatMessage(review.labels.schoolCareer)}
      goToScreen={goToScreen}
      route={route}
    />
  )
}

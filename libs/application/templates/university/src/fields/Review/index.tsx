import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, Divider } from '@island.is/island-ui/core'
import { ApplicantReview } from './ApplicantReview'
import { UniversityApplication } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import { ProgramReview } from './ProgramReview'
import { SchoolCareerReview } from './SchoolCareerReview'
import { OtherDocumentsReview } from './OtherDocumentsReview'

export const Review: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const answers = application.answers as UniversityApplication
  return (
    <Box>
      <Divider />
      <ProgramReview field={field} application={application} />
      <Divider />
      <ApplicantReview field={field} application={application} />
      <Divider />
      <SchoolCareerReview
        field={field}
        application={application}
        route={Routes.EDUCATIONDETAILS}
        goToScreen={goToScreen}
      />
      <Divider />
      <OtherDocumentsReview
        field={field}
        application={application}
        route={Routes.OTHERDOCUMENTS}
        goToScreen={goToScreen}
      />
    </Box>
  )
}

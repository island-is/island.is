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
  const educationList = answers.educationDetails

  return (
    <Box>
      <Divider />
      <ProgramReview
        field={field}
        application={application}
        route={Routes.PROGRAMINFORMATION}
        goToScreen={goToScreen}
      />
      <Divider />
      <ApplicantReview
        field={field}
        application={application}
        route={Routes.USERINFORMATION}
        goToScreen={goToScreen}
      />
      <Divider />
      {educationList &&
        educationList.length > 0 &&
        educationList.map((educationItem) => {
          return (
            <SchoolCareerReview
              educationItem={educationItem}
              field={field}
              application={application}
              route={Routes.EDUCATIONOPTIONS}
              goToScreen={goToScreen}
            />
          )
        })}
      <Divider />
    </Box>
  )
}

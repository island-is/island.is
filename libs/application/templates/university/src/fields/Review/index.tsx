import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, Divider } from '@island.is/island-ui/core'
import { ApplicantReview } from './ApplicantReview'
import { UniversityApplication } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import { ProgramReview } from './ProgramReview'
import { SchoolCareerReview } from './SchoolCareerReview'
import {
  EducationDetailsItem,
  EducationDetailsItemExemption,
  EducationDetailsItemNotFinished,
} from '../../shared/types'
import { ApplicationTypes } from '@island.is/university-gateway'
import { OtherDocumentsReview } from './OtherDocumentsReview'
import { getChosenProgram } from '../../utils'

export const Review: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const answers = application.answers as UniversityApplication
  const educationListFinished =
    answers.educationDetails.finishedDetails?.filter(
      (x) => x.wasRemoved === 'false',
    ) as Array<EducationDetailsItem>
  const educationOptionChosen = answers.educationOptions
  const educationExemption = answers.educationDetails
    .exemptionDetails as EducationDetailsItemExemption
  const educationThirdLevel = answers.educationDetails
    .thirdLevelDetails as EducationDetailsItem
  const educationNotFinished = answers.educationDetails
    .notFinishedDetails as EducationDetailsItemNotFinished

  const chosenProgram = getChosenProgram(application.externalData, answers)
  const showOtherDocuments =
    !!chosenProgram &&
    chosenProgram.extraApplicationFields &&
    chosenProgram.extraApplicationFields.length > 0

  return (
    <Box>
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
      {educationOptionChosen &&
        educationOptionChosen === ApplicationTypes.EXEMPTION && (
          <SchoolCareerReview
            educationItemExemption={educationExemption}
            field={field}
            application={application}
            route={Routes.EDUCATIONDETAILSFINISHED}
            goToScreen={goToScreen}
          />
        )}
      {educationOptionChosen &&
        educationOptionChosen === ApplicationTypes.THIRDLEVEL && (
          <SchoolCareerReview
            educationItemThirdLevel={educationThirdLevel}
            field={field}
            application={application}
            route={Routes.EDUCATIONDETAILSTHIRDLEVEL}
            goToScreen={goToScreen}
          />
        )}
      {educationOptionChosen &&
        educationOptionChosen === ApplicationTypes.NOTFINISHED && (
          <SchoolCareerReview
            educationItemNotFinished={educationNotFinished}
            field={field}
            application={application}
            route={Routes.EDUCATIONDETAILSNOTFINISHED}
            goToScreen={goToScreen}
          />
        )}
      {educationListFinished && educationListFinished.length > 0 && (
        <SchoolCareerReview
          educationItemsFinished={educationListFinished}
          field={field}
          application={application}
          route={Routes.EDUCATIONDETAILSFINISHED}
          goToScreen={goToScreen}
        />
      )}

      {showOtherDocuments && <Divider />}
      {showOtherDocuments && (
        <OtherDocumentsReview
          field={field}
          application={application}
          route={Routes.OTHERDOCUMENTS}
          goToScreen={goToScreen}
          extraApplicationFields={chosenProgram.extraApplicationFields}
        />
      )}
    </Box>
  )
}

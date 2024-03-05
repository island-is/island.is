import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider } from '@island.is/island-ui/core'
import { ApplicantReview } from '../Review/ApplicantReview'
import { UniversityApplication } from '../../lib/dataSchema'
import { Routes, States } from '../../lib/constants'
import { ProgramReview } from '../Review/ProgramReview'
import { SchoolCareerReview } from '../Review/SchoolCareerReview'
import { OtherDocumentsReview } from '../Review/OtherDocumentsReview'
import { useLazyApplicationQuery } from '../../hooks/useLazyApplicationQuery'
import { useLocale } from '@island.is/localization'
import { review } from '../../lib/messages'
import { AcceptConfirmationModal } from './AcceptConfirmationModal'
import {
  EducationDetailsItem,
  EducationDetailsItemExemption,
  EducationDetailsItemNotFinished,
} from '../../shared/types'
import { ApplicationTypes } from '@island.is/university-gateway'

export const Overview: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
  refetch,
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

  const [loading, setLoading] = useState(false)
  const { formatMessage } = useLocale()

  const [universityResponse, setUniversityResponse] = useState(false)
  const [acceptModalVisibility, setAcceptModalVisibility] =
    useState<boolean>(false)

  const getApplicationById = useLazyApplicationQuery()
  const getUniversityApplicationCallback = useCallback(
    async ({ id }: { id: string }) => {
      const { data } = await getApplicationById({
        id,
      })
      return data
    },
    [getApplicationById],
  )

  useEffect(() => {
    getUniversityApplicationCallback({ id: application.id }).then(
      (response) => {
        console.log('response', response)
        return
      },
    )
  }, [])

  // const onBackButtonClick = () => {
  //   setStep && setStep('states')
  // }

  const onRejectButtonClick = () => {
    setAcceptModalVisibility(true)
  }

  return (
    <Box>
      <Divider />
      <ProgramReview field={field} application={application} />
      <Divider />
      <ApplicantReview field={field} application={application} />
      <Divider />
      {educationOptionChosen &&
        educationOptionChosen === ApplicationTypes.EXEMPTION && (
          <SchoolCareerReview
            educationItemExemption={educationExemption}
            field={field}
            application={application}
            route={Routes.EDUCATIONDETAILSFINISHED}
          />
        )}
      {educationOptionChosen &&
        educationOptionChosen === ApplicationTypes.THIRDLEVEL && (
          <SchoolCareerReview
            educationItemThirdLevel={educationThirdLevel}
            field={field}
            application={application}
            route={Routes.EDUCATIONDETAILSTHIRDLEVEL}
          />
        )}
      {educationOptionChosen &&
        educationOptionChosen === ApplicationTypes.NOTFINISHED && (
          <SchoolCareerReview
            educationItemNotFinished={educationNotFinished}
            field={field}
            application={application}
            route={Routes.EDUCATIONDETAILSNOTFINISHED}
          />
        )}
      {educationListFinished && educationListFinished.length > 0 && (
        <SchoolCareerReview
          educationItemsFinished={educationListFinished}
          field={field}
          application={application}
          route={Routes.EDUCATIONDETAILSFINISHED}
        />
      )}
      <Divider />
      <OtherDocumentsReview
        field={field}
        application={application}
        route={Routes.OTHERDOCUMENTS}
        goToScreen={goToScreen}
      />
      <Box marginTop={14}>
        <Divider />
        <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
          {/* <Button variant="ghost" onClick={onBackButtonClick}>
            {formatMessage(review.buttons.back)}
          </Button> */}
          {universityResponse && application.state === States.PENDING_STUDENT && (
            <Box display="flex" justifyContent="flexEnd" flexWrap="wrap">
              <Box marginLeft={3}>
                <Button
                  icon="close"
                  colorScheme="destructive"
                  onClick={onRejectButtonClick}
                >
                  {formatMessage(review.buttons.reject)}
                </Button>
              </Box>
              {/* <Box marginLeft={3}>
                <Button
                  icon="checkmark"
                  loading={loading}
                  onClick={onApproveButtonClick}
                >
                  {formatMessage(review.buttons.approve)}
                </Button>
              </Box> */}
            </Box>
          )}
        </Box>
      </Box>
      <AcceptConfirmationModal
        visibility={acceptModalVisibility}
        setVisibility={setAcceptModalVisibility}
        application={application}
        refetch={refetch}
      />
    </Box>
  )
}

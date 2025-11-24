import { useMutation, useQuery } from '@apollo/client'
import { AccidentNotificationStatus } from '@island.is/api/schema'
import { FieldBaseProps, FormValue } from '@island.is/application/types'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { getAccidentStatusQuery } from '../../hooks/useLazyStatusOfNotification'
import { inReview } from '../../lib/messages'
import { SubmittedApplicationData } from '../../utils/types'
import { isUniqueAssignee } from '../../utils/miscUtils'
import { StatusStep } from './StatusStep'
import { ApplicationStatusProps } from './StatusStep/types'
import { getStatusAndApproval, getSteps } from './applicationStatusUtils'
import { getErrorMessageForMissingDocuments } from '../../utils/documentUtils'
import { ReviewApprovalEnum } from '../../utils/enums'
import React from 'react'

export const ApplicationStatus = ({
  goToScreen,
  application,
  refetch,
  field,
}: ApplicationStatusProps & FieldBaseProps) => {
  const isAssignee = field?.props?.isAssignee || false
  const subAppData = application.externalData
    .submitApplication as SubmittedApplicationData
  const ihiDocumentID = +(subAppData.data?.documentId || 0)
  const { setValue } = useFormContext()
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)
  const { locale, formatMessage } = useLocale()

  const {
    loading: loadingData,
    error,
    data,
  } = useQuery(getAccidentStatusQuery, {
    variables: { input: { ihiDocumentID: ihiDocumentID } },
    // Fetch every 5 minutes in case user leaves screen
    // open for long period of time and does not refresh.
    // We might get information from organization during that time.
    pollInterval: 300000,
  })

  const answers = application?.answers as FormValue
  const isAssigneeAndUnique = isUniqueAssignee(answers, isAssignee)

  const errorMessage = getErrorMessageForMissingDocuments(
    answers,
    formatMessage,
    isAssigneeAndUnique,
  )

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const { currentAccidentStatus, reviewApproval } =
    getStatusAndApproval(answers)

  const hasAccidentStatusChanged = useCallback(
    (
      newAccidentStatus: AccidentNotificationStatus,
      currentAccidentStatus: AccidentNotificationStatus,
    ) => {
      if (!currentAccidentStatus) {
        return true
      }
      if (
        newAccidentStatus.receivedAttachments?.InjuryCertificate !==
        currentAccidentStatus.receivedAttachments?.InjuryCertificate
      ) {
        return true
      }
      if (
        newAccidentStatus.receivedAttachments?.PoliceReport !==
        currentAccidentStatus.receivedAttachments?.PoliceReport
      ) {
        return true
      }
      if (
        newAccidentStatus.receivedAttachments?.ProxyDocument !==
        currentAccidentStatus.receivedAttachments?.ProxyDocument
      ) {
        return true
      }
      if (
        newAccidentStatus.receivedConfirmations?.CompanyParty !==
        currentAccidentStatus.receivedConfirmations?.CompanyParty
      ) {
        return true
      }
      if (
        newAccidentStatus.receivedConfirmations
          ?.InjuredOrRepresentativeParty !==
        currentAccidentStatus.receivedConfirmations
          ?.InjuredOrRepresentativeParty
      ) {
        return true
      }
      if (newAccidentStatus.status !== currentAccidentStatus.status) {
        return true
      }
      return false
    },
    [],
  )

  // assign to answers and refresh if accidentStatus answers are stale
  const assignValueToAnswersAndRefetch = useCallback(
    async (accidentStatus: AccidentNotificationStatus) => {
      if (accidentStatus) {
        setValue('accidentStatus', accidentStatus)
        const res = await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                ...application.answers,
                accidentStatus,
              },
            },
            locale,
          },
        })
        if (
          res.data &&
          refetch &&
          hasAccidentStatusChanged(accidentStatus, currentAccidentStatus)
        ) {
          refetch()
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // monitor data and if changes assign to answers
  useEffect(() => {
    if (data && data.HealthInsuranceAccidentStatus) {
      assignValueToAnswersAndRefetch(data.HealthInsuranceAccidentStatus)
    }
  }, [data, assignValueToAnswersAndRefetch])

  if (loadingData || loading) {
    return (
      <>
        <SkeletonLoader height={120} />
        <SkeletonLoader height={800} />
      </>
    )
  }

  // Todo add sentry log and design
  if (error || !currentAccidentStatus) {
    return (
      <Text>Ekki tókst að sækja stöðu umsóknar, eitthvað fór úrskeiðis.</Text>
    )
  }

  const steps = getSteps(
    formatMessage,
    answers,
    changeScreens,
    errorMessage,
    isAssignee,
    currentAccidentStatus,
  )

  return (
    <Box marginBottom={10}>
      <Text variant="h1" marginBottom={2}>
        {formatMessage(inReview.general.title)}
      </Text>
      <Box marginTop={4} display="flex" justifyContent="flexEnd">
        <Button
          colorScheme="default"
          iconType="filled"
          size="small"
          type="button"
          variant="text"
          onClick={() => changeScreens('inReviewOverviewScreen')}
        >
          {formatMessage(inReview.buttons.goToOverview)}
        </Button>
      </Box>
      {isAssignee &&
        (reviewApproval === ReviewApprovalEnum.APPROVED ||
          reviewApproval === ReviewApprovalEnum.REJECTED) && (
          <Box marginTop={4}>
            <AlertMessage
              type={
                reviewApproval === ReviewApprovalEnum.APPROVED
                  ? 'success'
                  : 'error'
              }
              title={
                reviewApproval === ReviewApprovalEnum.APPROVED
                  ? formatMessage(inReview.alertMessage.reviewApproved)
                  : formatMessage(inReview.alertMessage.reviewRejected)
              }
            />
          </Box>
        )}
      <Box marginTop={4} marginBottom={8}>
        {steps.map((step, index) => (
          <StatusStep
            key={index}
            title={step.title}
            description={step.description}
            hasActionMessage={step.hasActionMessage}
            action={step.action}
            tagText={step.tagText}
            tagVariant={step.tagVariant}
            visible={step.visible}
          />
        ))}
      </Box>
    </Box>
  )
}

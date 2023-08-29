import { useMutation, useQuery } from '@apollo/client'
import { AccidentNotificationStatus } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
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
import React, { FC, useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { AccidentNotificationAnswers } from '../..'
import { getAccidentStatusQuery } from '../../hooks/useLazyStatusOfNotification'
import { inReview } from '../../lib/messages'
import { ReviewApprovalEnum, SubmittedApplicationData } from '../../types'
import {
  getErrorMessageForMissingDocuments,
  hasReceivedAllDocuments,
  isInjuredAndRepresentativeOfCompanyOrInstitute,
  shouldRequestReview,
  isUniqueAssignee,
} from '../../utils'
import { hasReceivedConfirmation } from '../../utils/hasReceivedConfirmation'
import { StatusStep } from './StatusStep'
import {
  AccidentNotificationStatusEnum,
  ApplicationStatusProps,
  Steps,
} from './StatusStep/types'

export const ApplicationStatus: FC<
  React.PropsWithChildren<ApplicationStatusProps & FieldBaseProps>
> = ({ goToScreen, application, refetch, field }) => {
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

  const currentAccidentStatus = getValueViaPath(
    answers,
    'accidentStatus',
  ) as AccidentNotificationStatus

  const reviewApproval = getValueViaPath(
    answers,
    'reviewApproval',
    ReviewApprovalEnum.NOTREVIEWED,
  ) as ReviewApprovalEnum

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
    [],
  )

  // monitor data and if changes assign to answers
  useEffect(() => {
    if (data && data.HealthInsuranceAccidentStatus) {
      assignValueToAnswersAndRefetch(data.HealthInsuranceAccidentStatus)
    }
  }, [data, assignValueToAnswersAndRefetch])

  if (loadingData || loading || !currentAccidentStatus) {
    return (
      <>
        <SkeletonLoader height={120} />
        <SkeletonLoader height={800} />
      </>
    )
  }

  // Todo add sentry log and design
  if (error) {
    return (
      <Text>Ekki tókst að sækja stöðu umsóknar, eitthvað fór úrskeiðis.</Text>
    )
  }

  const tagMapperApplicationStatus = {
    [AccidentNotificationStatusEnum.ACCEPTED]: {
      variant: 'blue',
      text: inReview.tags.received,
    },
    [AccidentNotificationStatusEnum.REFUSED]: {
      variant: 'blue',
      text: inReview.tags.received,
    },
    [AccidentNotificationStatusEnum.INPROGRESS]: {
      variant: 'purple',
      text: inReview.tags.pending,
    },
    [AccidentNotificationStatusEnum.INPROGRESSWAITINGFORDOCUMENT]: {
      variant: 'purple',
      text: inReview.tags.pending,
    },
  }

  const hasReviewerSubmitted = hasReceivedConfirmation(answers)

  const steps = [
    {
      tagText: formatMessage(inReview.tags.received),
      tagVariant: 'blue',
      title: formatMessage(inReview.application.title),
      description: formatMessage(inReview.application.summary),
      hasActionMessage: false,
    },
    {
      tagText: hasReceivedAllDocuments(answers)
        ? formatMessage(inReview.tags.received)
        : formatMessage(inReview.tags.missing),
      tagVariant: hasReceivedAllDocuments(answers) ? 'blue' : 'rose',
      title: formatMessage(inReview.documents.title),
      description: formatMessage(inReview.documents.summary),
      hasActionMessage: errorMessage.length > 0,
      action: {
        cta: () => {
          changeScreens('addAttachmentScreen')
        },
        title: formatMessage(inReview.action.documents.title),
        description: formatMessage(inReview.action.documents.description),
        fileNames: errorMessage, // We need to get this from first form
        actionButtonTitle: formatMessage(
          inReview.action.documents.actionButtonTitle,
        ),
        hasActionButtonIcon: true,
        showAlways: true,
      },
    },
    // If this was a home activity accident than we don't want the user to see this step
    {
      tagText: hasReviewerSubmitted
        ? formatMessage(inReview.tags.received)
        : formatMessage(inReview.tags.missing),
      tagVariant: hasReviewerSubmitted ? 'blue' : 'rose',
      title: formatMessage(
        hasReviewerSubmitted
          ? inReview.representative.titleDone
          : inReview.representative.title,
      ),
      description: formatMessage(
        hasReviewerSubmitted
          ? inReview.representative.summaryDone
          : inReview.representative.summary,
      ),
      hasActionMessage: isAssignee && !hasReviewerSubmitted,
      action:
        isAssignee && !hasReviewerSubmitted
          ? {
              cta: () => changeScreens('inReviewOverviewScreen'),
              title: formatMessage(inReview.action.representative.title),
              description: formatMessage(
                inReview.action.representative.description,
              ),
              actionButtonTitle: formatMessage(
                inReview.action.representative.actionButtonTitle,
              ),
            }
          : undefined,
      visible: !(
        !shouldRequestReview(
          application.answers as AccidentNotificationAnswers,
        ) || isInjuredAndRepresentativeOfCompanyOrInstitute(application.answers)
      ),
    },
    {
      tagText: formatMessage(
        tagMapperApplicationStatus[currentAccidentStatus.status].text,
      ),
      tagVariant:
        tagMapperApplicationStatus[currentAccidentStatus.status].variant,
      title: formatMessage(inReview.sjukratrygging.title),
      description:
        hasReviewerSubmitted && hasReceivedAllDocuments(answers)
          ? formatMessage(inReview.sjukratrygging.summaryDone)
          : formatMessage(inReview.sjukratrygging.summary),
      hasActionMessage: false,
    },
  ] as Steps[]

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

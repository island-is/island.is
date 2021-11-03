import React, { FC, useCallback, useEffect } from 'react'
import { Box, Button, SkeletonLoader, Text } from '@island.is/island-ui/core'

import {
  FieldBaseProps,
  FormValue,
  getValueViaPath,
} from '@island.is/application/core'
import { States } from '../../constants'
import { useLocale } from '@island.is/localization'
import { ReviewSectionState } from '../../types'
import {
  isHomeActivitiesAccident,
  isInjuredAndRepresentativeOfCompanyOrInstitute,
  hasReceivedAllDocuments,
  getErrorMessageForMissingDocuments,
} from '../../utils'
import { inReview } from '../../lib/messages'
import { StatusStep } from './StatusStep'
import { getAccidentStatusQuery } from '../../hooks/useLazyStatusOfNotification'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { gql, useQuery } from '@apollo/client'

type StateMapEntry = { [key: string]: ReviewSectionState }

type StatesMap = {
  representative: StateMapEntry
  sjukratrygging: StateMapEntry
}

const statesMap: StatesMap = {
  representative: {
    [States.REVIEW]: ReviewSectionState.missing,
    [States.IN_FINAL_REVIEW]: ReviewSectionState.received,
  },
  sjukratrygging: {
    [States.REVIEW]: ReviewSectionState.pending,
    [States.IN_FINAL_REVIEW]: ReviewSectionState.inProgress,
  },
}

interface IAccidentStatus {
  status: string
  __typename: string
  attachments: Array<{
    isReceived: boolean
    attachmentType: string
    __typename: string
  }>
  confirmations: Array<{
    isReceived: boolean
    confirmationType: string
    __typename: string
  }>
}

interface SubmittedApplicationData {
  data?: {
    documentId: string
  }
}

interface ApplicationStatusProps {
  field: {
    props: {
      isAssignee: boolean
    }
  }
}

export const ApplicationStatus: FC<ApplicationStatusProps & FieldBaseProps> = ({
  goToScreen,
  application,
  refetch,
  field,
}) => {
  const isAssignee = field?.props?.isAssignee || false
  const subAppData = application.externalData
    .submitApplication as SubmittedApplicationData
  const ihiDocumentID = +(subAppData.data?.documentId || 0)
  const { setValue } = useFormContext()
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)
  const { locale, formatMessage } = useLocale()

  // Todo error state when service doesnt reply
  const { loading: loadingData, error, data } = useQuery(
    getAccidentStatusQuery,
    {
      variables: { input: { ihiDocumentID: ihiDocumentID } },
    },
  )

  const answers = application?.answers as FormValue

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const oldAccidentStatus = getValueViaPath(
    application.answers,
    'accidentStatus',
  ) as IAccidentStatus

  const hasAccidentStatusChanged = useCallback(
    (
      newAccidentStatus: IAccidentStatus,
      oldAccidentStatus: IAccidentStatus,
    ) => {
      if (
        newAccidentStatus.attachments.sort() !==
        oldAccidentStatus.attachments.sort()
      ) {
        return true
      }
      if (
        newAccidentStatus.confirmations.sort() !==
        oldAccidentStatus.confirmations.sort()
      ) {
        return true
      }
      if (newAccidentStatus.status !== oldAccidentStatus.status) {
        return true
      }
      return false
    },
    [],
  )

  // assign to answers and refresh if accidentStatus answers are stale
  const assignValueToAnswersAndRefetch = useCallback(async (accidentStatus) => {
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
        hasAccidentStatusChanged(accidentStatus, oldAccidentStatus) &&
        refetch
      ) {
        console.log('res', accidentStatus)
        refetch()
      }
    }
  }, [])

  // monitor data and if changes assign to answers
  useEffect(() => {
    if (data && data.accidentStatus) {
      assignValueToAnswersAndRefetch(data.accidentStatus)
    }
  }, [data, assignValueToAnswersAndRefetch])

  if (loadingData || loading) {
    return (
      <>
        <Text variant="h3" marginBottom={3}>
          <SkeletonLoader width={500} />
        </Text>
        <SkeletonLoader height={800} />
      </>
    )
  }

  const steps = [
    {
      state: ReviewSectionState.received,
      title: formatMessage(inReview.application.title),
      description: formatMessage(inReview.application.summary),
      hasActionMessage: false,
    },
    {
      state: hasReceivedAllDocuments(application.answers)
        ? ReviewSectionState.received
        : ReviewSectionState.missing,
      title: formatMessage(inReview.documents.title),
      description: formatMessage(inReview.documents.summary),
      hasActionMessage: !hasReceivedAllDocuments(application.answers),
      action: {
        cta: () => {
          changeScreens('addAttachmentScreen')
        },
        title: formatMessage(inReview.action.documents.title),
        description: formatMessage(inReview.action.documents.description),
        fileNames: getErrorMessageForMissingDocuments(answers, formatMessage), // We need to get this from first form
        actionButtonTitle: formatMessage(
          inReview.action.documents.actionButtonTitle,
        ),
        hasActionButtonIcon: true,
        showAlways: true,
      },
    },
    // If this was a home activity accident than we don't want the user to see this step
    {
      state: statesMap['representative'][application.state],
      title: formatMessage(inReview.representative.title),
      description: formatMessage(inReview.representative.summary),
      hasActionMessage: isAssignee,
      action: {
        cta: () => changeScreens('inReviewOverviewScreen'),
        title: formatMessage(inReview.action.representative.title),
        description: formatMessage(inReview.action.representative.description),
        actionButtonTitle: formatMessage(
          inReview.action.representative.actionButtonTitle,
        ),
      },
      visible:
        !isHomeActivitiesAccident(application.answers) ||
        !isInjuredAndRepresentativeOfCompanyOrInstitute(application.answers),
    },
    {
      state: statesMap['sjukratrygging'][application.state],
      title: formatMessage(inReview.sjukratrygging.title),
      description: formatMessage(inReview.sjukratrygging.summary),
      hasActionMessage: false,
    },
  ]

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
          Skoða yfirlit
        </Button>
      </Box>
      <Box marginTop={4} marginBottom={8}>
        {steps.map((step, index) => (
          <StatusStep key={index} application={application} {...step} />
        ))}
      </Box>
    </Box>
  )
}

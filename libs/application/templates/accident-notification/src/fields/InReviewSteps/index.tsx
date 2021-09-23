import { useMutation } from '@apollo/client'
import {
  DefaultEvents,
  FieldBaseProps,
  FormValue,
} from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { States } from '../../constants'
import { AccidentNotification } from '../../lib/dataSchema'
import { inReview } from '../../lib/messages'
import { ReviewSectionState } from '../../types'
import {
  hasMissingDocuments,
  isHomeActivitiesAccident,
  isReportingOnBehalfOfInjured,
  isRepresentativeOfCompanyOrInstitute,
  returnMissingDocumentsList,
} from '../../utils'
import ReviewSection from './ReviewSection'

type StateMapEntry = { [key: string]: ReviewSectionState }

type StatesMap = {
  application: StateMapEntry
  documents: StateMapEntry
  representative: StateMapEntry
  sjukratrygging: StateMapEntry
}

const statesMap: StatesMap = {
  application: {
    [States.NEEDS_DOCUMENT_AND_REVIEW]: ReviewSectionState.received,
    [States.NEEDS_REVIEW]: ReviewSectionState.received,
    [States.NEEDS_DOCUMENT]: ReviewSectionState.received,
  },
  documents: {
    [States.NEEDS_DOCUMENT_AND_REVIEW]: ReviewSectionState.missing,
    [States.NEEDS_REVIEW]: ReviewSectionState.received,
    [States.NEEDS_DOCUMENT]: ReviewSectionState.missing,
  },
  representative: {
    [States.NEEDS_DOCUMENT_AND_REVIEW]: ReviewSectionState.missing,
    [States.NEEDS_REVIEW]: ReviewSectionState.missing,
    [States.NEEDS_DOCUMENT]: ReviewSectionState.approved,
  },
  sjukratrygging: {
    [States.NEEDS_DOCUMENT_AND_REVIEW]: ReviewSectionState.pending,
    [States.NEEDS_REVIEW]: ReviewSectionState.pending,
    [States.NEEDS_DOCUMENT]: ReviewSectionState.pending,
  },
}

type InReviewStepsProps = {
  field: {
    props: {
      isAssignee?: boolean
    }
  }
}

export const InReviewSteps: FC<FieldBaseProps & InReviewStepsProps> = ({
  application,
  refetch,
  field,
}) => {
  const { formatMessage } = useLocale()

  console.log(application)
  const isAssignee = field.props.isAssignee || false
  console.log(isAssignee)

  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => console.error(e.message),
    },
  )

  const showMissingDocumentsMessage = (answers: FormValue) => {
    if (
      hasMissingDocuments(answers) &&
      ((isReportingOnBehalfOfInjured(answers) && isAssignee) ||
        (!isReportingOnBehalfOfInjured(answers) && !isAssignee))
    ) {
      return true
    }
    return false
  }

  const answers = application.answers as AccidentNotification

  const steps = [
    {
      state: statesMap['application'][application.state],
      title: formatMessage(inReview.application.title),
      description: formatMessage(inReview.application.summary),
      hasActionMessage: false,
    },
    {
      state: statesMap['documents'][application.state],
      title: formatMessage(inReview.documents.title),
      description: formatMessage(inReview.documents.summary),
      hasActionMessage: showMissingDocumentsMessage(application.answers),
      action: {
        title: formatMessage(inReview.action.documents.title),
        description: formatMessage(inReview.action.documents.description),
        fileNames: returnMissingDocumentsList(answers, formatMessage), // We need to get this from first form
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
      hasActionMessage:
        application.state === States.NEEDS_DOCUMENT_AND_REVIEW ||
        application.state === States.NEEDS_REVIEW,
      action: {
        title: formatMessage(inReview.action.representative.title),
        description: formatMessage(inReview.action.representative.description),
        actionButtonTitle: formatMessage(
          inReview.action.representative.actionButtonTitle,
        ),
      },
      visible:
        !isHomeActivitiesAccident(application.answers) ||
        !isRepresentativeOfCompanyOrInstitute(application.answers),
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
      {/* TODO: We need to do this some other way!
       application.state === States.DOCUMENTS_HAVE_BEEN_DELIVERED && (
        <AlertMessage
          type="success"
          title={formatMessage(inReview.infoMessages.applicationUpdated)}
        />
      ) */}
      <Box marginTop={4} display="flex" justifyContent="flexEnd">
        <Button
          colorScheme="default"
          iconType="filled"
          size="small"
          type="button"
          variant="text"
          loading={loadingSubmit}
          disabled={loadingSubmit}
          onClick={async () => {
            const res = await submitApplication({
              variables: {
                input: {
                  id: application.id,
                  event: DefaultEvents.SUBMIT,
                  answers: application.answers,
                },
              },
            })

            if (res?.data) {
              // Takes them to the next state (which loads the relevant form)
              refetch?.()
            }
          }}
        >
          {formatMessage(inReview.general.viewApplicationButton)}
        </Button>
      </Box>
      <Box marginTop={4} marginBottom={8}>
        {steps.map((step, index) => (
          <ReviewSection
            key={index}
            application={application}
            refetch={refetch}
            {...step}
          />
        ))}
      </Box>
    </Box>
  )
}

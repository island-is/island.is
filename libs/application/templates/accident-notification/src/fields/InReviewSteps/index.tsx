import { FieldBaseProps } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { States } from '../../constants'
import { inReview } from '../../lib/messages'
import ReviewSection, { ReviewSectionState } from './ReviewSection'

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

export const InReviewSteps: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
  errors,
}) => {
  const { formatMessage } = useLocale()

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
      description:
        application.state === States.DELIVERY_OF_DOCUMENTS
          ? formatMessage(inReview.documents.summary)
          : formatMessage(inReview.documents.summaryApproved),
      hasActionMessage:
        application.state === States.NEEDS_DOCUMENT_AND_REVIEW ||
        application.state === States.NEEDS_DOCUMENT,
      action: {
        title: formatMessage(inReview.action.documents.title),
        description: formatMessage(inReview.action.documents.description),
        fileNames: 'Áverkavottorð', // We need to get this from first form
        actionButtonTitle: formatMessage(
          inReview.action.documents.actionButtonTitle,
        ),
        hasActionButtonIcon: true,
      },
    },
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
      {/* TODO: We need to do this through answers!
       application.state === States.DOCUMENTS_HAVE_BEEN_DELIVERED && (
        <AlertMessage
          type="success"
          title={formatMessage(inReview.infoMessages.applicationUpdated)}
        />
      ) */}
      <Box marginTop={7} marginBottom={8}>
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

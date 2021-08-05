import { FieldBaseProps } from '@island.is/application/core'
import { AlertMessage, Box } from '@island.is/island-ui/core'
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
    [States.DELIVERY_OF_DOCUMENTS]: ReviewSectionState.received,
  },
  documents: {
    [States.DELIVERY_OF_DOCUMENTS]: ReviewSectionState.missingDocuments,
    [States.DOCUMENTS_HAVE_BEEN_DELIVERED]: ReviewSectionState.received,
  },
  representative: {
    [States.DELIVERY_OF_DOCUMENTS]: ReviewSectionState.inProgress,
    [States.DOCUMENTS_HAVE_BEEN_DELIVERED]: ReviewSectionState.inProgress,
  },
  sjukratrygging: {
    [States.DELIVERY_OF_DOCUMENTS]: ReviewSectionState.pending,
    [States.DOCUMENTS_HAVE_BEEN_DELIVERED]: ReviewSectionState.pending,
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
    },
    {
      state: statesMap['documents'][application.state],
      title: formatMessage(inReview.documents.title),
      description:
        application.state === States.DELIVERY_OF_DOCUMENTS
          ? formatMessage(inReview.documents.summary)
          : formatMessage(inReview.documents.summaryApproved),
    },
    {
      state: statesMap['representative'][application.state],
      title: formatMessage(inReview.representative.title),
      description: formatMessage(inReview.representative.summary),
    },
    {
      state: statesMap['sjukratrygging'][application.state],
      title: formatMessage(inReview.sjukratrygging.title),
      description: formatMessage(inReview.sjukratrygging.summary),
    },
  ]

  return (
    <Box marginBottom={10}>
      {application.state === States.DOCUMENTS_HAVE_BEEN_DELIVERED && (
        <AlertMessage
          type="success"
          title={formatMessage(inReview.infoMessages.applicationUpdated)}
        />
      )}
      <Box marginTop={7} marginBottom={8}>
        {steps.map((step, index) => (
          <ReviewSection key={index} application={application} {...step} />
        ))}
      </Box>
    </Box>
  )
}

import { Application, FormValue } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { States } from '../../constants'
import { AccidentNotification } from '../../lib/dataSchema'
import { inReview } from '../../lib/messages'
import { ReviewSectionState } from '../../types'
import {
  hasMissingDocuments,
  isHomeActivitiesAccident,
  isInjuredAndRepresentativeOfCompanyOrInstitute,
  isReportingOnBehalfOfInjured,
  returnMissingDocumentsList,
} from '../../utils'
import ReviewSection from './ReviewSection'

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

type InReviewStepsProps = {
  application: Application
  isAssignee: boolean
  setState: React.Dispatch<React.SetStateAction<string>>
}

export const InReviewSteps: FC<InReviewStepsProps> = ({
  application,
  isAssignee,
  setState,
}) => {
  const { formatMessage } = useLocale()

  const showMissingDocumentsMessage = (answers: FormValue) => {
    return !!(
      hasMissingDocuments(answers) &&
      ((isReportingOnBehalfOfInjured(answers) && isAssignee) ||
        (!isReportingOnBehalfOfInjured(answers) && !isAssignee))
    )
  }

  const goToScreenFunction = (id: string) => {
    setState(id)
  }

  const goToOverview = () => {
    setState('overview')
  }

  const answers = application.answers as AccidentNotification

  const steps = [
    {
      state: ReviewSectionState.received,
      title: formatMessage(inReview.application.title),
      description: formatMessage(inReview.application.summary),
      hasActionMessage: false,
    },
    {
      state: hasMissingDocuments(application.answers)
        ? ReviewSectionState.missing
        : ReviewSectionState.received,
      title: formatMessage(inReview.documents.title),
      description: formatMessage(inReview.documents.summary),
      hasActionMessage: hasMissingDocuments(answers),
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
      hasActionMessage: isAssignee,
      action: {
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
          onClick={goToOverview}
        >
          {formatMessage(inReview.general.viewApplicationButton)}
        </Button>
      </Box>
      <Box marginTop={4} marginBottom={8}>
        {steps.map((step, index) => (
          <ReviewSection
            key={index}
            application={application}
            goToScreen={goToScreenFunction}
            {...step}
          />
        ))}
      </Box>
    </Box>
  )
}

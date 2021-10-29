import React, { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'

import { FieldBaseProps } from '@island.is/application/core'
import { States } from '../../constants'
import { useLocale } from '@island.is/localization'
import { ReviewSectionState } from '../../types'
import {
  hasMissingDocuments,
  isHomeActivitiesAccident,
  isInjuredAndRepresentativeOfCompanyOrInstitute,
  returnMissingDocumentsList,
} from '../../utils'
import { inReview } from '../../lib/messages'
import { AccidentNotification } from '../../lib/dataSchema'
import { StatusStep } from './StatusStep'

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
export const ApplicationStatus: FC<FieldBaseProps> = ({
  goToScreen,
  application,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const answers = application?.answers as AccidentNotification

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }
  const isAssignee = false

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
      hasActionMessage: hasMissingDocuments(application.answers),
      action: {
        cta: () => {
          changeScreens('addAttachmentScreen')
        },
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
      ctaScreenName: 'inReviewOverviewScreen',
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
          onClick={() => changeScreens('inReviewOverviewScreen')}
        >
          Skoða yfirlit
        </Button>
      </Box>
      <Box marginTop={4} marginBottom={8}>
        {steps.map((step, index) => (
          <StatusStep
            key={index}
            application={application}
            goToScreen={() => {}}
            {...step}
          />
        ))}
      </Box>
    </Box>
  )
}

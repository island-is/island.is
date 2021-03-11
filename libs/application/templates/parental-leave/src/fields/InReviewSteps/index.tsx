import React, { FC, useState } from 'react'

import { useLocale } from '@island.is/localization'

import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import ReviewSection, { ReviewSectionState } from './ReviewSection'
import Review from '../Review'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { YES } from '../../constants'

type StateMapEntry = { [key: string]: ReviewSectionState }
type StatesMap = {
  otherParent: StateMapEntry
  employer: StateMapEntry
  vinnumalastofnun: StateMapEntry
}
const statesMap: StatesMap = {
  otherParent: {
    otherParentApproval: ReviewSectionState.inProgress,
    otherParentRequiresAction: ReviewSectionState.requiresAction,
    employerApproval: ReviewSectionState.complete,
    vinnumalastofnunApproval: ReviewSectionState.complete,
  },
  employer: {
    employerWaitingToAssign: ReviewSectionState.inProgress,
    employerApproval: ReviewSectionState.inProgress,
    employerRequiresAction: ReviewSectionState.requiresAction,
    vinnumalastofnunApproval: ReviewSectionState.complete,
  },
  vinnumalastofnun: {
    vinnumalastofnunApproval: ReviewSectionState.inProgress,
    vinnumalastofnunRequiresAction: ReviewSectionState.requiresAction,
    approved: ReviewSectionState.complete,
  },
}

const InReviewSteps: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const [screenState, setScreenState] = useState<'steps' | 'viewApplication'>(
    'steps',
  )

  const isRequestingRights =
    (getValueViaPath(
      application.answers,
      'requestRights.isRequestingRights',
    ) as string) === YES

  const steps = [
    {
      state: statesMap['otherParent'][application.state],
      title: formatMessage(
        parentalLeaveFormMessages.reviewScreen.otherParentTitle,
      ),
      description: formatMessage(
        parentalLeaveFormMessages.reviewScreen.otherParentDesc,
      ),
    },
    {
      state: statesMap['employer'][application.state],
      title: formatMessage(
        parentalLeaveFormMessages.reviewScreen.employerTitle,
      ),
      description: formatMessage(
        parentalLeaveFormMessages.reviewScreen.employerDesc,
      ),
    },
    {
      state: statesMap['vinnumalastofnun'][application.state],
      title: formatMessage(parentalLeaveFormMessages.reviewScreen.deptTitle),
      description: formatMessage(
        parentalLeaveFormMessages.reviewScreen.deptDesc,
      ),
    },
  ]

  if (!isRequestingRights) steps.shift()

  return (
    <Box marginBottom={10}>
      <Box display="flex" justifyContent="spaceBetween">
        <Text>
          {(screenState === 'steps' &&
            formatMessage(parentalLeaveFormMessages.reviewScreen.desc)) ||
            formatMessage(parentalLeaveFormMessages.reviewScreen.descReview)}
        </Text>
        <Box>
          <Box display="inlineBlock" marginLeft={1} marginRight={2}>
            <Button
              colorScheme="default"
              iconType="filled"
              onClick={() =>
                setScreenState(
                  (screenState === 'steps' && 'viewApplication') || 'steps',
                )
              }
              size="small"
              type="button"
              variant="text"
            >
              {(screenState === 'steps' &&
                formatMessage(
                  parentalLeaveFormMessages.reviewScreen.buttonsView,
                )) ||
                formatMessage(
                  parentalLeaveFormMessages.reviewScreen.buttonsViewProgress,
                )}
            </Button>
            {/* TODO: 
              Edit button goes here when the edit flow is ready to merge. 
              The functionlity and code is in rfc.index.tsx. We will bring
              it over when ready, and then delete that file.
            */}
          </Box>
        </Box>
      </Box>

      {(screenState === 'steps' && (
        <Box marginTop={7} marginBottom={8}>
          {steps.map((step, index) => {
            return (
              <ReviewSection
                key={index}
                application={application}
                index={index + 1}
                {...step}
              />
            )
          })}
        </Box>
      )) || (
        <Box marginTop={7} marginBottom={8}>
          <Review application={application} editable={false} />
        </Box>
      )}
    </Box>
  )
}

export default InReviewSteps

import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'

import {
  FieldBaseProps,
  getValueViaPath,
  MessageFormatter,
} from '@island.is/application/core'
import {
  Box,
  Button,
  DialogPrompt,
  Text,
  toast,
} from '@island.is/island-ui/core'
import ReviewSection, { reviewSectionState } from './ReviewSection'
import Review from '../Review'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { YES } from '../../constants'

import { SUBMIT_APPLICATION } from '@island.is/application/graphql'

function handleError(error: string, formatMessage: MessageFormatter): void {
  toast.error(
    formatMessage(
      {
        id: 'application.system:submit.error',
        defaultMessage: 'Eitthvað fór úrskeiðis: {error}',
        description: 'Error message on submit',
      },
      { error },
    ),
  )
}

type stateMapEntry = { [key: string]: reviewSectionState }
type statesMap = {
  otherParent: stateMapEntry
  employer: stateMapEntry
  vinnumalastofnun: stateMapEntry
}
const statesMap: statesMap = {
  otherParent: {
    otherParentApproval: reviewSectionState.inProgress,
    otherParentRequiresAction: reviewSectionState.requiresAction,
    employerApproval: reviewSectionState.complete,
    vinnumalastofnunApproval: reviewSectionState.complete,
  },
  employer: {
    employerWaitingToAssign: reviewSectionState.inProgress,
    employerApproval: reviewSectionState.inProgress,
    employerRequiresAction: reviewSectionState.requiresAction,
    vinnumalastofnunApproval: reviewSectionState.complete,
  },
  vinnumalastofnun: {
    vinnumalastofnunApproval: reviewSectionState.inProgress,
    vinnumalastofnunRequiresAction: reviewSectionState.requiresAction,
    approved: reviewSectionState.complete,
  },
}

const InReviewSteps: FC<FieldBaseProps> = ({ application, refetch }) => {
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleError(e.message, formatMessage),
    },
  )

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
          </Box>
          <Box display="inlineBlock">
            <Button
              colorScheme="default"
              iconType="filled"
              size="small"
              type="button"
              variant="text"
              icon="pencil"
              loading={loadingSubmit}
              disabled={loadingSubmit}
              onClick={async () => {
                const res = await submitApplication({
                  variables: {
                    input: {
                      id: application.id,
                      event: 'EDIT',
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
              {formatMessage(
                parentalLeaveFormMessages.reviewScreen.buttonsEdit,
              )}
            </Button>
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

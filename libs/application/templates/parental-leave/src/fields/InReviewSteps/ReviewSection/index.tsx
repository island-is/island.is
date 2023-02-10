import React, { FC } from 'react'
import cn from 'classnames'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { formatText, coreMessages } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { handleServerError } from '@island.is/application/ui-components'
import { Box, Icon, Tag, Text, Button } from '@island.is/island-ui/core'
import { parentalLeaveFormMessages } from '../../../lib/messages'

import * as styles from './ReviewSection.css'

export enum ReviewSectionState {
  inProgress = 'In progress',
  requiresAction = 'Requires action',
  complete = 'Complete',
}

type ReviewSectionProps = {
  index: number
  title: string
  description: string
  state?: ReviewSectionState
}

const ReviewSection: FC<ReviewSectionProps & FieldBaseProps> = ({
  application,
  index,
  title,
  description,
  state,
  refetch,
}) => {
  const { formatMessage } = useLocale()
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )

  const isRequiredAction = state === ReviewSectionState.requiresAction

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      padding={4}
      marginBottom={2}
    >
      {/* Section Number */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        className={cn(styles.sectionNumber, {
          [styles.sectionNumberNotStarted]: state === undefined,
          [styles.sectionNumberInProgress]:
            state === ReviewSectionState.inProgress,
          [styles.sectionNumberRequiresAction]: isRequiredAction,
          [styles.sectionNumberComplete]: state === ReviewSectionState.complete,
        })}
      >
        {(state === ReviewSectionState.complete && (
          <Icon color="white" size="small" icon="checkmark" />
        )) || <span className={styles.sectionNumberText}>{index}</span>}
      </Box>

      {/* Contents */}
      <Box
        alignItems="flexStart"
        display="flex"
        flexDirection={['columnReverse', 'row']}
        justifyContent="spaceBetween"
      >
        <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
          <Text variant="h3">{title}</Text>
          <Text marginTop={1} variant="default">
            {description}
          </Text>
        </Box>

        {state === ReviewSectionState.inProgress && (
          <Box pointerEvents="none">
            <Tag variant="blue">
              {formatText(
                coreMessages.tagsInProgress,
                application,
                formatMessage,
              )}
            </Tag>
          </Box>
        )}
        {isRequiredAction && (
          <Box>
            <Box pointerEvents="none" marginBottom={1}>
              <Tag variant="red">
                {formatText(
                  coreMessages.tagsRequiresAction,
                  application,
                  formatMessage,
                )}
              </Tag>
            </Box>
            <Box display="flex" justifyContent="flexEnd" marginTop={1}>
              <Button
                icon="arrowForward"
                variant="text"
                size="small"
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
                  parentalLeaveFormMessages.reviewScreen
                    .additionalDocumentRequiredButton,
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReviewSection

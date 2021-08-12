import { useMutation } from '@apollo/client'
import { Application } from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { Box, Button, Text } from '@island.is/island-ui/core'
import cn from 'classnames'
import React, { FC } from 'react'
import * as styles from './ReviewSection.treat'
import { ReviewTag } from './ReviewTag'

export enum ReviewSectionState {
  inProgress = 'In progress',
  received = 'Received',
  missing = 'Missing documents',
  pending = 'Pending',
  approved = 'Approved',
  objected = 'Objected',
}

type ActionProps = {
  title: string
  description: string
  fileNames?: string
  actionButtonTitle: string
  hasActionButtonIcon?: boolean
}

type ReviewSectionProps = {
  application: Application
  title: string
  description: string
  state?: ReviewSectionState
  hasActionMessage: boolean
  refetch?: () => void
  action?: ActionProps
}

const ReviewSection: FC<ReviewSectionProps> = ({
  application,
  title,
  description,
  state,
  hasActionMessage,
  action,
  refetch,
}) => {
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => console.log(e.message),
    },
  )

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      marginBottom={2}
    >
      {/* Contents */}
      <Box
        alignItems="flexStart"
        display="flex"
        flexDirection={['columnReverse', 'row']}
        justifyContent="spaceBetween"
        padding={4}
      >
        <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
          <Text variant="h3">{title}</Text>
          <Text marginTop={1} variant="default">
            {description}
          </Text>
        </Box>

        <ReviewTag application={application} state={state} />
      </Box>

      {/* Action messages */}
      {hasActionMessage && action && (
        <Box
          alignItems="flexStart"
          display="flex"
          flexDirection={['columnReverse', 'row']}
          justifyContent="spaceBetween"
          background="roseTinted100"
          padding={4}
        >
          <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
            <Text variant="h5">{action.title}</Text>
            <Text marginTop={1} variant="default">
              {action.description}{' '}
              {action.fileNames && (
                <span className={cn(styles.boldFileNames)}>
                  {action.fileNames}
                </span>
              )}
            </Text>
            <Box marginTop={1}>
              <Button
                colorScheme="default"
                icon={action.hasActionButtonIcon ? 'attach' : undefined}
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
                        event: 'EDIT',
                        answers: application.answers,
                      },
                    },
                  })
                  console.log(res)

                  if (res) console.log(res)
                  if (res?.data) {
                    // Takes them to the next state (which loads the relevant form)
                    refetch?.()
                  }
                }}
              >
                {action.actionButtonTitle}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ReviewSection

import { Application } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { ReviewTag } from './ReviewTag'

export enum ReviewSectionState {
  inProgress = 'In progress',
  received = 'Received',
  missingDocuments = 'Missing documents',
  pending = 'Pending',
  approved = 'Approved',
  objected = 'Objected',
}

type ReviewSectionProps = {
  application: Application
  title: string
  description: string
  state?: ReviewSectionState
}

const ReviewSection: FC<ReviewSectionProps> = ({
  application,
  title,
  description,
  state,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      padding={4}
      marginBottom={2}
    >
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

        <ReviewTag application={application} state={state} />
      </Box>
    </Box>
  )
}

export default ReviewSection

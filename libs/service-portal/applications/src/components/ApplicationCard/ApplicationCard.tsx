import React, { FC } from 'react'
import {
  Box,
  Stack,
  Text,
  Tag,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import * as styles from './ApplicationCard.treat'
import ProgressBar from '../ProgressBar/ProgressBar'
import { m } from '../../lib/messages'

interface Props {
  name: string
  date: string
  isApplicant?: boolean
  isAssignee?: boolean
  isComplete?: boolean
  url: string
  progress: number
}

const ApplicationCard: FC<Props> = ({
  name,
  date,
  isApplicant,
  isAssignee,
  isComplete,
  url,
  progress,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      className={styles.wrapper}
      paddingY={3}
      paddingX={4}
      border="standard"
      borderRadius="large"
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Stack space={1}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            marginBottom={1}
          >
            <Text variant="h3" as="h3">
              {name}
            </Text>

            {isApplicant && (
              <Box marginLeft="auto" marginRight={2}>
                <Tag disabled variant="darkerBlue">
                  {formatMessage(m.cardTagApplicant)}
                </Tag>
              </Box>
            )}

            {isAssignee && (
              <Box marginLeft="auto" marginRight={2}>
                <Tag disabled variant="darkerMint">
                  {formatMessage(m.cardTagAssignee)}
                </Tag>
              </Box>
            )}

            <Tag disabled variant={isComplete ? 'mint' : 'purple'} outlined>
              {isComplete
                ? formatMessage(m.cardStatusDone)
                : formatMessage(m.cardStatusInProgress)}
            </Tag>
          </Box>

          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="spaceBetween"
          >
            <Text>
              {isComplete
                ? formatMessage(m.cardStatusCopyDone, { name })
                : formatMessage(m.cardStatusCopyInProgress, { name })}
            </Text>

            <Text variant="small">{date}</Text>
          </Box>

          <Columns space={8} alignY="center" collapseBelow="md">
            <Column>
              <ProgressBar progress={progress} />
            </Column>
          </Columns>
        </Stack>
      </a>
    </Box>
  )
}

export default ApplicationCard

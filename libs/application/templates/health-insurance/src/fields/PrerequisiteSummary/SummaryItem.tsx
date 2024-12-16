import { Box, Button, Icon, Tag, Text } from '@island.is/island-ui/core'

import * as styles from './SummaryItem.css'
import { Application } from '@island.is/application/types'
import HtmlParser from 'react-html-parser'

export enum SummaryItemState {
  requiresAction = 'Requires action',
  complete = 'Complete',
}

type SummaryItemProps = {
  index: number
  prerequisiteMet: boolean
  application: Application
  title: string
  description: string
  furtherInformationTitle: string
  furtherInformationDescription: string
  buttonText: string
  buttonLink: string
  tagText: string
}

export const SummaryItem = ({
  title,
  description,
  furtherInformationTitle,
  furtherInformationDescription,
  buttonText,
  prerequisiteMet,
  buttonLink,
  tagText,
  index,
}: SummaryItemProps) => {
  return (
    <Box
      position="relative"
      border="standard"
      background={prerequisiteMet ? 'white' : 'red100'}
      marginBottom={4}
      borderRadius={'large'}
    >
      <Box
        padding={4}
        marginBottom={2}
        background={'white'}
        borderRadius={'large'}
        className={!prerequisiteMet && styles.borderRadiusLargeTopOnly}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          borderRadius="full"
          className={styles.sectionNumber}
        >
          {prerequisiteMet ? (
            <Icon color="white" size="small" icon="checkmark" />
          ) : (
            <span className={styles.sectionNumberText}>{index}</span>
          )}
        </Box>

        <Box
          alignItems="flexStart"
          display="flex"
          flexDirection={['columnReverse', 'row']}
          justifyContent="spaceBetween"
        >
          <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
            <Text variant="h3">{title}</Text>
            <Text marginTop={1} variant="default">
              {HtmlParser(description)}
            </Text>
          </Box>
          <Box pointerEvents="none">
            <Tag variant={prerequisiteMet ? 'blue' : 'red'}>{tagText}</Tag>
          </Box>
        </Box>
      </Box>
      {!prerequisiteMet && (
        <Box paddingX={4} marginBottom={2}>
          <Text variant="h3">{HtmlParser(furtherInformationTitle)}</Text>
          <Text>{HtmlParser(furtherInformationDescription)}</Text>
          <Button
            variant="text"
            onClick={() => {
              window.location.href = buttonLink
            }}
          >
            {buttonText}
          </Button>
        </Box>
      )}
    </Box>
  )
}

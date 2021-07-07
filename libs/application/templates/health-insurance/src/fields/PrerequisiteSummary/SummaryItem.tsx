import React, { FC } from 'react'
import { Box, Button, Icon, Tag, Text } from '@island.is/island-ui/core'

import * as styles from './SummaryItem.treat'
import { Application } from '@island.is/application/core'
import { MessageDescriptor } from 'react-intl'

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
}

// based on eligibilitysummary from driving license
// two possible states
// done, needs work,
// why not just keep the component dumb and make it render a list of
// items with status and translation strings links to read more and issue
// do i need to hook up the data provider for every item?
// probably have to use the application data that is populated by the
// data provider and set that to that field
// any issue on having data providers?
const SummaryItem: FC<SummaryItemProps> = ({
  title,
  description,
  furtherInformationTitle,
  furtherInformationDescription,
  buttonText,
  prerequisiteMet,
  index,
}) => {
  prerequisiteMet = true
  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      background={prerequisiteMet ? 'white' : 'red100'}
      marginBottom={2}
    >
      <Box
        borderRadius="large"
        padding={4}
        marginBottom={2}
        background={'white'}
      >
        {/* Section Number */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          borderRadius="circle"
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
              {description}
            </Text>
          </Box>

          {!prerequisiteMet && (
            <Box pointerEvents="none">
              <Tag variant="red">{SummaryItemState.requiresAction}</Tag>
            </Box>
          )}
        </Box>
      </Box>
      {!prerequisiteMet && (
        <Box>
          <Text>{furtherInformationTitle}</Text>
          <Text>{furtherInformationDescription}</Text>
          <Button variant="text">{buttonText}</Button>
        </Box>
      )}
    </Box>
  )
}

export default SummaryItem

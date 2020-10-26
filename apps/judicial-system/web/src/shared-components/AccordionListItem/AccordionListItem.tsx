import { Box, Text } from '@island.is/island-ui/core'
import React, { PropsWithChildren } from 'react'
import * as styles from './AccordionListItem.treat'

interface AccordionListItemProps {
  title: string
  breakSpaces?: boolean
}

const AccordionListItem: React.FC<AccordionListItemProps> = (
  props: PropsWithChildren<AccordionListItemProps>,
) => {
  return (
    <>
      <Box marginBottom={1}>
        <Text variant="h5">{props.title}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text>
          {props.breakSpaces ? (
            <span className={styles.breakSpaces}>{props.children}</span>
          ) : (
            props.children
          )}
        </Text>
      </Box>
    </>
  )
}

export default AccordionListItem

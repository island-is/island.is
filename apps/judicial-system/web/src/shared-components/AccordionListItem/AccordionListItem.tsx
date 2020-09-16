import { Box, Text } from '@island.is/island-ui/core'
import React, { PropsWithChildren } from 'react'

interface AccordionListItemProps {
  title: string
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
        <Text>{props.children}</Text>
      </Box>
    </>
  )
}

export default AccordionListItem

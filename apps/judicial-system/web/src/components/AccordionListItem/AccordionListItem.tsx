import React, { PropsWithChildren } from 'react'

import { Box, Text } from '@island.is/island-ui/core'

interface AccordionListItemProps {
  title: string
  breakSpaces?: boolean
}

const AccordionListItem: React.FC<
  React.PropsWithChildren<AccordionListItemProps>
> = (props: PropsWithChildren<AccordionListItemProps>) => {
  return (
    <>
      <Box marginBottom={1}>
        <Text variant="h5" as="h5">
          {props.title}
        </Text>
      </Box>
      <Box marginBottom={3}>
        {props.breakSpaces ? (
          <Text as="span" whiteSpace="breakSpaces">
            {props.children}
          </Text>
        ) : (
          props.children
        )}
      </Box>
    </>
  )
}

export default AccordionListItem

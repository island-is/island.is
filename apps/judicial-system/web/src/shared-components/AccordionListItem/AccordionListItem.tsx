import { Box, Typography } from '@island.is/island-ui/core'
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
        <Typography variant="h5">{props.title}</Typography>
      </Box>
      <Box marginBottom={3}>
        <Typography>{props.children}</Typography>
      </Box>
    </>
  )
}

export default AccordionListItem

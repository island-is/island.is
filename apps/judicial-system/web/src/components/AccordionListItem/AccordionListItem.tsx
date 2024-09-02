import { FC, PropsWithChildren } from 'react'

import { Box, Text } from '@island.is/island-ui/core'

interface AccordionListItemProps {
  title: string
  breakSpaces?: boolean
}

const AccordionListItem: FC<PropsWithChildren<AccordionListItemProps>> = ({
  title,
  breakSpaces,
  children,
}) => {
  return (
    <>
      <Box marginBottom={1}>
        <Text variant="h5" as="h5">
          {title}
        </Text>
      </Box>
      <Box marginBottom={3}>
        {breakSpaces ? (
          <Text as="span" whiteSpace="breakSpaces">
            {children}
          </Text>
        ) : (
          children
        )}
      </Box>
    </>
  )
}

export default AccordionListItem

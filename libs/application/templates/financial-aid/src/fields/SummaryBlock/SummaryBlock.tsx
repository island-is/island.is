import React, { ReactNode } from 'react'
import { Text, Box, Button } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'

import { summaryForm } from '../../lib/messages'

interface Props {
  sectionTitle: string
  editAction?(): void
  children: ReactNode
}

const SummaryBlock = ({ sectionTitle, children, editAction }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="flexStart"
      paddingY={[4, 4, 5]}
      borderTopWidth="standard"
      borderColor="blue300"
    >
      <Box>
        <Text fontWeight="semiBold">{sectionTitle}</Text>
        {children}
      </Box>
      <Button
        icon="pencil"
        iconType="filled"
        variant="utility"
        onClick={editAction}
      >
        {formatMessage(summaryForm.block.buttonLabel)}
      </Button>
    </Box>
  )
}

export default SummaryBlock

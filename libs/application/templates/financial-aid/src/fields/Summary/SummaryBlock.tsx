import React, { ReactNode } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button } from '@island.is/island-ui/core'
import { summaryForm } from '../../lib/messages'
import * as styles from '../Shared.css'

interface Props {
  editAction?: () => void
  children: ReactNode
}

const SummaryBlock = ({ children, editAction }: Props) => {
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
      <Box className={styles.summaryBlockChild}>{children}</Box>
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

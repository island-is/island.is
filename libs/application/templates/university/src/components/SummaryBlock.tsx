import { ReactNode } from 'react'

import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { review } from '../lib/messages'
interface Props {
  editAction?: () => void
  children: ReactNode
}

const SummaryBlock = ({ children, editAction }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="flexStart"
      paddingY={[4, 4, 5]}
      borderTopWidth="standard"
      borderColor="blue300"
    >
      <Box width="full">{children}</Box>
      <Button
        icon="pencil"
        iconType="filled"
        variant="utility"
        onClick={editAction}
      >
        {formatMessage(review.labels.changeButtonText)}
      </Button>
    </Box>
  )
}

export default SummaryBlock

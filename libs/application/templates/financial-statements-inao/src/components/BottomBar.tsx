import React, { Fragment } from 'react'

import { Box, Button, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

type Props = {
  onBackButtonClick: () => void
  onSendButtonClick: () => void
  loading?: boolean
}

const BottomBar = ({
  onBackButtonClick,
  onSendButtonClick,
  loading = false,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Fragment>
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick} disabled={loading}>
          {formatMessage(m.goBack)}
        </Button>
        <Button icon="checkmark" onClick={onSendButtonClick} loading={loading}>
          {formatMessage(m.send)}
        </Button>
      </Box>
    </Fragment>
  )
}

export default BottomBar

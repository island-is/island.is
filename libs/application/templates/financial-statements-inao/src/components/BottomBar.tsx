import React, { Fragment } from 'react'

import { Box, Button, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

type Props = {
  onBackButtonClick: () => void
  onSendButtonClick: () => void
}

const BottomBar = ({ onBackButtonClick, onSendButtonClick }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Fragment>
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick}>
          {formatMessage(m.goBack)}
        </Button>
        <Button icon="checkmark" onClick={onSendButtonClick}>
          {formatMessage(m.send)}
        </Button>
      </Box>
    </Fragment>
  )
}

export default BottomBar

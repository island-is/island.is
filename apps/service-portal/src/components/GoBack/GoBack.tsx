import { Box, HyphenProps, Button } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React from 'react'
import { useHistory } from 'react-router-dom'

// Á þetta að fara bara tilbaka eða alltaf á dashboard skjá
export const GoBack = () => {
  const history = useHistory()

  return (
    <Box display={['none', 'none', 'block']} printHidden marginBottom={3}>
      <Button
        preTextIcon="arrowBack"
        preTextIconType="filled"
        size="small"
        type="button"
        variant="text"
        truncate
        onClick={() => history.replace('/')}
      >
        Til baka
      </Button>
    </Box>
  )
}

export default GoBack

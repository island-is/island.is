import { Box, HyphenProps, Button } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Á þetta að fara bara tilbaka eða alltaf á dashboard skjá
export const GoBack = () => {
  const navigate = useNavigate()

  return (
    <Box display={['none', 'none', 'block']} printHidden marginBottom={3}>
      <Button
        preTextIcon="arrowBack"
        preTextIconType="filled"
        size="small"
        type="button"
        variant="text"
        truncate
        onClick={() => navigate('/')}
      >
        Til baka í yfirlit
      </Button>
    </Box>
  )
}

export default GoBack

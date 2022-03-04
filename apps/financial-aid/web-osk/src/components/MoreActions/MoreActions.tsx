import React from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'

interface Props {
  homepage?: string
  email?: string
}

const MoreActions = ({ homepage, email }: Props) => {
  if (!homepage && !email) {
    return null
  }

  return (
    <Box>
      <Text as="h4" variant="h3" marginBottom={2} marginTop={[3, 3, 7]}>
        Frekari aðgerðir í boði
      </Text>
      <Box marginBottom={[5, 5, 10]}>
        {homepage && (
          <Box marginBottom={2}>
            <Button
              icon="open"
              iconType="outline"
              size="small"
              variant="text"
              onClick={() => {
                window.open(homepage, '_ blank')
              }}
            >
              Upplýsingar um fjárhagsaðstoð
            </Button>
          </Box>
        )}
        {email && (
          <Box>
            <Button
              icon="open"
              iconType="outline"
              size="small"
              variant="text"
              onClick={() => {
                window.open(`mailto: ${email}`, '_ blank')
              }}
            >
              Hafa samband
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MoreActions

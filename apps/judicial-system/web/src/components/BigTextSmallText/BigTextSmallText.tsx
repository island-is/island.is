import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  bigText: string
  smallText?: string
}

const BigTextSmallText: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { bigText, smallText } = props

  return (
    <>
      <Box component="span" display="block">
        {bigText}
      </Box>
      {smallText && (
        <Text as="span" variant="small">
          {smallText}
        </Text>
      )}
    </>
  )
}

export default BigTextSmallText

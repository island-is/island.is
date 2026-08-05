import { FC, PropsWithChildren } from 'react'

import { Box, ResponsiveProp, Space, Text } from '@island.is/island-ui/core'
interface Props {
  marginBottom?: ResponsiveProp<Space>
}

const PageTitle: FC<PropsWithChildren<Props>> = (props) => {
  const { marginBottom, children } = props

  return (
    <Box
      marginBottom={marginBottom ?? 7}
      display="flex"
      justifyContent="spaceBetween"
    >
      <Text as="h1" variant="h1">
        {children}
      </Text>
    </Box>
  )
}

export default PageTitle

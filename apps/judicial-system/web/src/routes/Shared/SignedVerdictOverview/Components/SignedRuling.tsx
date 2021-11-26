import React from 'react'
import { Box, Icon, Text } from '@island.is/island-ui/core'

interface Props {
  judge?: string
}

export const SignedRuling = (props: Props) => {
  const { judge } = props

  console.log('Judge: ', judge)

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flexEnd"
        marginRight="gutter"
      >
        <Text>Undirritað - 12.12.2021 kl. 10:14</Text>
        <Text>{judge}</Text>
      </Box>
      <Icon icon="checkmark" size="large" color="mint600"></Icon>
    </Box>
  )
}

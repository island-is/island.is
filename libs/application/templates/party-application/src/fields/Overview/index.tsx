import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { Approved } from '@island.is/application/ui-components'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const Overview: FC<Props> = () => {
  return (
    <Box marginTop={4}>
      <Text marginBottom={3} variant="h4">
        Reykjavíkurkjördæmi suður
      </Text>

      <Approved
        title="Meðmælendalista hefur verið skilað"
        subtitle=" Þú munt fá skilaboð í pósthólf inni á mínum síðum Ísland.is með framhaldið."
      />
    </Box>
  )
}

export default Overview

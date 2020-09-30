import { Box, GridColumn, GridRow, Typography } from '@island.is/island-ui/core'
import { HikingFigure } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import useAuth from '../../hooks/useAuth/useAuth'

const Greeting: FC<{}> = () => {
  const { userInfo } = useAuth()

  return (
    <GridRow>
      <GridColumn span={['12/12', '7/12']}>
        <Box marginTop={[2, 3, 8]} marginBottom={2}>
          <Typography variant="h1">Velkominn aftur,</Typography>
          <Typography variant="h3" color="purple400">
            {userInfo?.user.profile.name}
          </Typography>
        </Box>
      </GridColumn>
      <GridColumn span={['12/12', '5/12']}>
        <HikingFigure />
      </GridColumn>
    </GridRow>
  )
}

export default Greeting

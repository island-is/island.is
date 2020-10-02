import { Box, GridColumn, GridRow, Typography } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HikingFigure } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import useAuth from '../../hooks/useAuth/useAuth'

const Greeting: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()

  return (
    <GridRow>
      <GridColumn span={['12/12', '7/12']}>
        <Box marginTop={[2, 3, 8]} marginBottom={2}>
          <Typography variant="h1">
            {formatMessage({
              defaultMessage: 'Velkomin/nn aftur',
              description: 'Welcome user',
              id: 'service.portal:welcome-back',
            })}
          </Typography>
          <Typography variant="h3" color="purple400">
            {userInfo?.profile.name}
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

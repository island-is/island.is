import { Box, GridColumn, GridRow, Typography } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import * as styles from './Greeting.treat'
import useAuth from '../../hooks/useAuth/useAuth'

const Greeting: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const currentHour = new Date().getHours()
  const isEveningGreeting = currentHour > 17 || currentHour < 4

  return (
    <GridRow>
      <GridColumn span={['12/12', '7/12']}>
        <Box marginTop={[2, 3, 8]} marginBottom={2}>
          <Typography variant="h1">
            {isEveningGreeting
              ? formatMessage({
                  defaultMessage: 'Góða kvöldið,',
                  description: 'Welcome the user during the evening',
                  id: 'service.portal:good-evening',
                })
              : formatMessage({
                  defaultMessage: 'Góðan dag,',
                  description: 'Welcome the user during the day',
                  id: 'service.portal:good-day',
                })}
          </Typography>
          <Typography variant="h3" color="purple400">
            {userInfo?.profile.name}
          </Typography>
        </Box>
      </GridColumn>
      <GridColumn span={['12/12', '5/12']}>
        <Box className={styles.figure} />
      </GridColumn>
    </GridRow>
  )
}

export default Greeting

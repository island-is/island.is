import React, { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { m } from '@island.is/service-portal/core'
import * as styles from './Greeting.css'

const Greeting: FC<React.PropsWithChildren<{}>> = () => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const currentHour = new Date().getHours()

  const isEveningGreeting = currentHour > 17 || currentHour < 4

  return (
    <GridRow className={styles.greetingContainer} marginTop={4}>
      <GridColumn span={['12/12', '7/12']}>
        <Box marginTop={[2, 3, 4]} data-testid="greeting">
          <Text
            variant="eyebrow"
            marginBottom={2}
            fontWeight="semiBold"
            color="purple400"
          >
            {isEveningGreeting
              ? formatMessage(m.eveningGreeting)
              : formatMessage(m.dayGreeting)}
          </Text>
          <Text translate="no" variant="h2" as="h1" marginBottom={1}>
            {userInfo?.profile.name}
          </Text>
          <Text marginBottom={2}>{formatMessage(m.greetingIntro)}</Text>
        </Box>
      </GridColumn>
    </GridRow>
  )
}

export default Greeting

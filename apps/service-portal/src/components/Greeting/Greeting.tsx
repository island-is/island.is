import React, { FC } from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { m } from '@island.is/service-portal/core'
import * as styles from './Greeting.css'

const Greeting: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const { loadingMessages } = useNamespaces(['service.portal'])
  const { userInfo } = useAuth()
  const currentHour = new Date().getHours()
  const isEveningGreeting = currentHour > 17 || currentHour < 4

  return (
    <GridRow className={styles.greetingContainer} marginTop={4}>
      <GridColumn span={['12/12', '7/12']}>
        <Box marginTop={[2, 3, 4]} data-testid="greeting">
          {loadingMessages ? (
            <Box paddingBottom={3}>
              <LoadingDots color="blue" />
            </Box>
          ) : (
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
          )}
          <Text variant="h2" as="h1" marginBottom={1}>
            {userInfo?.profile.name}
          </Text>
          {loadingMessages ? (
            <Box paddingTop={1} paddingBottom={5}>
              <LoadingDots color="blue" />
            </Box>
          ) : (
            <Text marginBottom={2}>{formatMessage(m.greetingIntro)}</Text>
          )}
        </Box>
      </GridColumn>
    </GridRow>
  )
}

export default Greeting

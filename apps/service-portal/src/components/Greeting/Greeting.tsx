import React, { FC } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { LEGACY_MY_PAGES_URL } from '@island.is/service-portal/constants'

import * as styles from './Greeting.treat'

const Greeting: FC<{}> = () => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const currentHour = new Date().getHours()
  const isEveningGreeting = currentHour > 17 || currentHour < 4

  return (
    <GridRow>
      <GridColumn span={['12/12', '7/12']}>
        <Box marginTop={[2, 3, 4]}>
          <Text
            variant="eyebrow"
            marginBottom={2}
            fontWeight="semiBold"
            color="purple400"
          >
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
          </Text>
          <Text variant="h1" as="h1" marginBottom={1}>
            {userInfo?.profile.name}
          </Text>
          <Text marginBottom={2}>
            {formatMessage({
              id: 'service.portal:greeting-intro',
              defaultMessage: `
              Beta útgáfa af mínum síðum er komin í loftið!
              Ef þú finnur ekki þjónustu sem var á gömlu mínum
              síðum þá getur þú fundið þær upplýsingar hér.
              `,
            })}
          </Text>
          <div>
            <a href={LEGACY_MY_PAGES_URL} target="_blank">
              <Button variant="text" icon="open" iconType="outline">
                {formatMessage({
                  id: 'service.portal:older-version',
                  defaultMessage: 'Eldri útgáfa',
                })}
              </Button>
            </a>
          </div>
        </Box>
      </GridColumn>
      <GridColumn span={['12/12', '5/12']}>
        <Box className={styles.figure} />
      </GridColumn>
    </GridRow>
  )
}

export default Greeting

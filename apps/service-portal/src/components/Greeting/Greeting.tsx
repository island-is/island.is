import React, { FC } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Text,
} from '@island.is/island-ui/core'
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
    <GridContainer>
      <GridRow className={styles.greetingContainer}>
        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12']}
          offset={['0', '0', '0', '1/12']}
        >
          <Box
            marginTop={[2, 3, 3, 0]}
            paddingLeft={[0, 0, 0, 0]}
            data-testid="greeting"
            className={styles.greetingTextBox}
          >
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
            <Text paddingBottom={[2, 3, 4, 0]} marginBottom={2}>
              {formatMessage(m.greetingIntro)}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn span={'6/12'}>
          <Hidden below="lg">
            <Box display="flex" justifyContent="center">
              <img
                src={
                  'https://images.ctfassets.net/8k0h54kbe6bj/FkLayBlYHDlSq15d4qjbp/1bc08bc72413a20e746917b082ffeaeb/Skraut.svg'
                }
                className={styles.greetingSvg}
                alt=""
              />
            </Box>
          </Hidden>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Greeting

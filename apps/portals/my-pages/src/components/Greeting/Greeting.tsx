import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import { SearchInput } from '../SearchInput/SearchInput'
import * as styles from './Greeting.css'

// This and everything that changes in compact mode can be removed once
// the new dashboard is fully deployed and we remove the old one.
interface GreetingProps {
  compact?: boolean
}

const Greeting = ({ compact = false }: GreetingProps) => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const currentHour = new Date().getHours()

  const isEveningGreeting = currentHour > 17 || currentHour < 4

  const [showSearch, setShowSearch] = useState<boolean>(false)

  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        'isMyPagesSearchEnabled',
        false,
      )
      if (ffEnabled) {
        setShowSearch(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const illustration = compact ? (
    <Box
      display="flex"
      alignItems="flexEnd"
      justifyContent="flexEnd"
      paddingRight={3}
    >
      <img
        src="./assets/images/illustration.svg"
        className={styles.image}
        alt=""
      />
    </Box>
  ) : (
    <img
      src="https://images.ctfassets.net/8k0h54kbe6bj/FkLayBlYHDlSq15d4qjbp/1bc08bc72413a20e746917b082ffeaeb/Skraut.svg"
      className={styles.image}
      alt=""
    />
  )

  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', compact ? '6/12' : '5/12']}
          offset={['0', '0', '0', compact ? '0' : '1/12']}
        >
          <Box marginTop={compact ? 6 : 9} data-testid="greeting">
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
            {!compact && (
              <Text paddingBottom={[2, 3, 4, 0]} marginBottom={2}>
                {formatMessage(m.greetingIntro)}
              </Text>
            )}
            {showSearch && (
              <Box marginTop={3} marginBottom={compact ? [3, 3, 3, 6] : 3}>
                <SearchInput
                  colorScheme={compact ? 'default' : 'blue'}
                  whiteMenuBackground={compact}
                  size="large"
                  placeholder={formatMessage(m.searchOnMyPages)}
                  buttonAriaLabel={formatMessage(m.searchOnMyPages)}
                />
              </Box>
            )}
          </Box>
        </GridColumn>
        <GridColumn span={'6/12'}>
          <Hidden below="lg">
            <Box display="flex" justifyContent="flexEnd">
              {illustration}
            </Box>
          </Hidden>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Greeting

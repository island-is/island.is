import {
  AsyncSearchInput,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { m } from '@island.is/portals/my-pages/core'
import * as styles from './Greeting.css'
import Search from '../Search/Search'

const Greeting = () => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const currentHour = new Date().getHours()

  const isEveningGreeting = currentHour > 17 || currentHour < 4

  return (
    <GridContainer>
      <GridRow className={styles.greetingContainer} marginTop={5}>
        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12']}
          offset={['0', '0', '0', '1/12']}
          paddingTop={4}
        >
          <Box
            marginTop={[2, 3, 3, 0]}
            paddingLeft={[0, 0, 0, 0]}
            data-testid="greeting"
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

          <Search />
        </GridColumn>
        <GridColumn span={'6/12'}>
          <Hidden below="lg">
            <Box display="flex" justifyContent="flexEnd">
              <img src={'./assets/images/greeting.svg'} alt="" aria-hidden />
            </Box>
          </Hidden>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Greeting

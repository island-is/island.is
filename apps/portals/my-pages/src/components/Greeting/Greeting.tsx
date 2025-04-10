import {
  Box,
  ColorSchemeContext,
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
import { SearchInput } from '../SearchInput/SearchInput'

const Greeting = () => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const currentHour = new Date().getHours()

  const isEveningGreeting = currentHour > 17 || currentHour < 4

  const k = 8
  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12']}
          offset={['0', '0', '0', '1/12']}
        >
          <Box marginTop={9} data-testid="greeting">
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
            <Box marginY={3}>
              <SearchInput
                colorScheme="blue"
                size="large"
                placeholder={formatMessage(m.searchOnMyPages)}
                buttonAriaLabel={formatMessage(m.searchOnMyPages)}
              />
            </Box>
          </Box>
        </GridColumn>
        <GridColumn span={'6/12'}>
          <Hidden below="lg">
            <Box display="flex" justifyContent="center">
              <img
                src={
                  'https://images.ctfassets.net/8k0h54kbe6bj/FkLayBlYHDlSq15d4qjbp/1bc08bc72413a20e746917b082ffeaeb/Skraut.svg'
                }
                className={styles.image}
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

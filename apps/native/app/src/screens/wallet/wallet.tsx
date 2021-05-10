import { LicenceCard, Alert } from '@island.is/island-ui-native'
import React, { useRef } from 'react'
import styled from 'styled-components/native'
import { Animated } from 'react-native'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useScreenOptions } from '../../contexts/theme-provider'
import { navigateTo } from '../../utils/deep-linking'
import { testIDs } from '../../utils/test-ids'
import { LIST_LICENSES_QUERY } from '../../graphql/queries/list-licenses.query'
import isVerifiedLogo from '../../assets/icons/is-verified.png'
import agencyLogo from '../../assets/temp/agency-logo.png'
import { LicenseType } from '../../types/license-type'
import { ComponentRegistry } from '../../utils/navigation-registry'
import { useIntl } from '../../utils/intl'
import { useTranslatedTitle } from '../../utils/use-translated-title'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Wrapper = styled(Animated.View)``

function mapLicenseColor(type: LicenseType) {
  let backgroundColor = '#eeeeee'
  if (type === LicenseType.DRIVERS_LICENSE) {
    backgroundColor = '#f5e4ec'
  }
  if (type === LicenseType.IDENTIDY_CARD) {
    backgroundColor = '#fff7e7'
  }
  if (type === LicenseType.PASSPORT) {
    backgroundColor = '#ddefff'
  }
  if (type === LicenseType.WEAPON_LICENSE) {
    backgroundColor = '#fffce0'
  }
  return backgroundColor
}

export const WalletScreen: NavigationFunctionComponent = () => {
  const theme = useTheme()
  const intl = useIntl()
  const res = useQuery(LIST_LICENSES_QUERY, { client })
  const licenseItems = res?.data?.listLicenses ?? []

  useTranslatedTitle('WALLET_NAV_TITLE', 'wallet.screenTitle')

  useScreenOptions(
    () => ({
      bottomTab: {
        testID: testIDs.TABBAR_TAB_WALLET,
        selectedIconColor: theme.color.blue400,
        icon: require('../../assets/icons/tabbar-wallet.png'),
        selectedIcon: require('../../assets/icons/tabbar-wallet-selected.png'),
        iconColor: theme.isDark ? theme.color.white : theme.color.dark400,
        text: intl.formatMessage({ id: 'wallet.bottomTabText' }),
      },
    }),
    [theme],
  )

  const sharedAnimatedValue = useRef(new Animated.Value(0))

  const renderLicenseItem = ({
    item
  }: {
    item: {
      id: string
      title: string
      serviceProvider: string
      type: LicenseType
    }
  }) => (
    <TouchableOpacity
      style={{ marginBottom: 16 }}
      onPress={() =>
        navigateTo(`/wallet/${item.id}`, {
          item,
          fromId: `license-${item.id}_source`,
          toId: `license-${item.id}_destination`,
        })
      }
    >
      <SafeAreaView>
      <LicenceCard
        nativeID={`license-${item.id}_source`}
        title={item.title}
        icon={isVerifiedLogo}
        backgroundColor={mapLicenseColor(item.type)}
        agencyLogo={agencyLogo}
      />
      </SafeAreaView>
    </TouchableOpacity>
  )

  return (
    <>
      <Alert
        type="info"
        message="Til að nota skírteini sem gild skilríki þarf að færa þau yfir í Apple Wallet."
        offsetY={sharedAnimatedValue}
      />
      <Animated.FlatList
        testID={testIDs.SCREEN_HOME}
        style={{
          paddingHorizontal: 16,
          paddingTop: 24,
          transform: [
            {
              translateY: sharedAnimatedValue.current,
            },
          ],
        }}
        data={licenseItems}
        keyExtractor={(item: any) => item.id}
        renderItem={renderLicenseItem}
      />
      <BottomTabsIndicator index={2} total={3} />
    </>
  )
}

WalletScreen.options = {
  topBar: {
    title: {
      component: {
        id: 'WALLET_NAV_TITLE',
        name: ComponentRegistry.NavigationBarTitle,
        passProps: {
          title: 'Wallet',
        },
      },
      alignment: 'fill',
    },
  },
}

import { LicenceCard, Alert } from '@island.is/island-ui-native'
import React, { useRef, useState } from 'react'
import { Animated, FlatList, TouchableOpacity } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'
import { useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useScreenOptions } from '../../contexts/theme-provider'
import { navigateTo } from '../../utils/deep-linking'
import { testIDs } from '../../utils/test-ids'
import { LIST_LICENSES_QUERY } from '../../graphql/queries/list-licenses.query'
import agencyLogo from '../../assets/temp/agency-logo.png'
import { LicenseType } from '../../types/license-type'
import { useIntl } from '../../utils/intl'
import { createNavigationTitle } from '../../utils/create-navigation-title'

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

const { useNavigationTitle, title } = createNavigationTitle('wallet.screenTitle');

export const WalletScreen: NavigationFunctionComponent = ({ componentId }) => {
  const theme = useTheme()
  const intl = useIntl()
  const res = useQuery(LIST_LICENSES_QUERY, { client })
  const licenseItems = res?.data?.listLicenses ?? []

  useNavigationTitle(componentId);

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

  const flRef = useRef<FlatList>();
  const [alertVisible, setAlertVisible] = useState(true);
  const [offset, setOffset] = useState(alertVisible);

  const renderLicenseItem = ({
    item,
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
          backgroundColor={mapLicenseColor(item.type)}
          agencyLogo={agencyLogo}
        />
      </SafeAreaView>
    </TouchableOpacity>
  )

  return (
    <>
        {offset && <Alert
          visible={alertVisible}
          type="info"
          message="Til að nota skírteini sem gild skilríki þarf að færa þau yfir í Apple Wallet."
          onClose={() => {
            setAlertVisible(false);
            flRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
          }}
          onClosed={() => {
            setOffset(false);
          }}
        />}
        <Animated.FlatList
          ref={flRef as any}
          testID={testIDs.SCREEN_HOME}
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          contentInset={{
            top: offset ? 70 : 0,
          }}
          contentOffset={{
            x: 0,
            y: offset ? -70 : 0,
          }}
          style={{
            paddingTop: 16,
            paddingHorizontal: 16,
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
    title
  },
}

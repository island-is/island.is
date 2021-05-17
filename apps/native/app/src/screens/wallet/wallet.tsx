import { useQuery } from '@apollo/client'
import { Alert, LicenceCard } from '@island.is/island-ui-native'
import React, { useRef, useState } from 'react'
import { Platform } from 'react-native'
import {
  Animated,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components/native'
import agencyLogo from '../../assets/temp/agency-logo.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useScreenOptions } from '../../contexts/theme-provider'
import { client } from '../../graphql/client'
import { LIST_LICENSES_QUERY } from '../../graphql/queries/list-licenses.query'
import { usePreferencesStore } from '../../stores/preferences-store'
import { LicenseType } from '../../types/license-type'
import { createNavigationTitle } from '../../utils/create-navigation-title'
import { navigateTo } from '../../utils/deep-linking'
import { useIntl } from '../../utils/intl'
import { testIDs } from '../../utils/test-ids'

const { useNavigationTitle, title } = createNavigationTitle(
  'wallet.screenTitle',
)

export const WalletScreen: NavigationFunctionComponent = ({ componentId }) => {
  const theme = useTheme()
  const intl = useIntl()
  const { dismiss, dismissed } = usePreferencesStore()
  const res = useQuery(LIST_LICENSES_QUERY, { client })
  const licenseItems = res?.data?.listLicenses ?? []

  useNavigationTitle(componentId)

  useScreenOptions(
    () => ({
      bottomTab: {
        testID: testIDs.TABBAR_TAB_WALLET,
        iconInsets: {
          bottom: 1,
        },
        selectedIconColor: theme.color.blue400,
        icon: require('../../assets/icons/tabbar-wallet.png'),
        selectedIcon: require('../../assets/icons/tabbar-wallet-selected.png'),
        iconColor: theme.isDark ? theme.color.white : theme.color.dark400,
        text: intl.formatMessage({ id: 'wallet.bottomTabText' }),
        textColor: theme.shade.foreground,
        selectedTextColor: theme.shade.foreground,
      },
    }),
    [theme],
  )

  const flRef = useRef<FlatList>()
  const [alertVisible, setAlertVisible] = useState(true)
  const [offset, setOffset] = useState(alertVisible)

  const renderLicenseItem = ({
    item,
  }: {
    item: {
      id: string
      title: string
      serviceProvider: string
      dateTime: string
      status: string
      type: LicenseType
    }
  }) => (
    <TouchableHighlight
      style={{ marginBottom: 16, borderRadius: 16 }}
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
          type={item.type}
          date={item.dateTime}
          status={item.status}
          agencyLogo={agencyLogo}
        />
      </SafeAreaView>
    </TouchableHighlight>
  )

  return (
    <>
      {offset && Platform.OS === 'ios' && (
        <Alert
          visible={!dismissed.includes('howToUseCertificates')}
          type="info"
          message="Til að nota skírteini sem gild skilríki þarf að færa þau yfir í Apple Wallet."
          onClose={() => {
            dismiss('howToUseCertificates')
            flRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            })
          }}
          onClosed={() => {
            setOffset(false)
          }}
        />
      )}
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
          zIndex: 9,
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
    title,
  },
}

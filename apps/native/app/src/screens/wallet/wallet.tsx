import { Card, ListItem, LicenceCard, Alert } from '@island.is/island-ui-native'
import React, { useRef } from 'react'
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity, Animated } from 'react-native'
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

const Wrapper = styled(Animated.View)`
`;

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
  const intl = useIntl();
  const res = useQuery(LIST_LICENSES_QUERY, { client })
  const licenseItems = res?.data?.listLicenses ?? []

  useTranslatedTitle('WALLET_NAV_TITLE', 'wallet.screenTitle');

  useScreenOptions(
    () => ({
      bottomTab: {
        testID: testIDs.TABBAR_TAB_WALLET,
        selectedIconColor: theme.color.blue400,
        icon: require('../../assets/icons/tabbar-wallet.png'),
        selectedIcon: require('../../assets/icons/tabbar-wallet-selected.png'),
        iconColor: theme.isDark ? theme.color.white : theme.color.dark400,
        text: intl.formatMessage({ id: 'wallet.bottomTabText'}),
      },
    }),
    [theme],
  )

  const myLicenses = licenseItems.length
    ? [licenseItems[1], licenseItems[0], licenseItems[2], licenseItems[3]]
    : []

  const sharedAnimatedValue = useRef(new Animated.Value(0));

  return (
    <>
      {/* <ScrollView horizontal={false}> */}
        {/* <ScrollView
          horizontal
          snapToInterval={260 + 30}
          showsHorizontalScrollIndicator={false}
          snapToAlignment={'start'}
          contentInset={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 30,
          }}
          contentInsetAdjustmentBehavior="automatic"
          decelerationRate={0}
          style={{ marginTop: 50, marginBottom: 10 }}
        >
          {myLicenses.map((license) => {
            const backgroundColor = mapLicenseColor(license.type)
            return (
              <TouchableOpacity
                key={license.id}
                onPress={() =>
                  navigateTo(`/wallet/${license.id}`, { backgroundColor })
                }
              >
                <Card backgroundColor={backgroundColor} title={license.title} />
              </TouchableOpacity>
            )
          })}
        </ScrollView> */}
      <Wrapper
        style={{
          marginTop: 10,
          transform: [{
            translateY: sharedAnimatedValue.current,
          }],
        }}
      >
        <Alert
          type="info"
          message="Til að nota skírteini sem gild skilríki þarf að færa þau yfir í Apple Wallet."
          offsetY={sharedAnimatedValue}
        />
        <Animated.ScrollView
          testID={testIDs.SCREEN_HOME}
          style={{
            paddingHorizontal: 16,
            paddingTop: 24,
          }}
        >
        {licenseItems.map(
          ({
            id,
            title,
            serviceProvider,
            type,
          }: {
            id: string
            title: string
            serviceProvider: string
            type: LicenseType
          }) => (
            <LicenceCard
              key={id}
              title={title}
              icon={isVerifiedLogo}
              backgroundColor={mapLicenseColor(type)}
              agencyLogo={agencyLogo}
              onPress={() =>
                navigateTo(`/wallet/${id}`, {
                  backgroundColor: mapLicenseColor(type),
                })
              }
            />
          ),
        )}
        </Animated.ScrollView>
        </Wrapper>
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
        }
      },
      alignment: 'fill'
    },
  },
}

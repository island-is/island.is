import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { SafeAreaView, ScrollView, TouchableHighlight } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks'
import styled, { useTheme } from 'styled-components/native'

import { FamilyMemberCard, MoreCard } from '../../ui'
import assetsIcon from '../../assets/icons/assets.png'
import familyIcon from '../../assets/icons/family.png'
import financeIcon from '../../assets/icons/finance.png'
import vehicleIcon from '../../assets/icons/vehicle.png'
import airplaneIcon from '../../assets/icons/airplane.png'
import healthIcon from '../../assets/icons/health.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { formatNationalId } from '../../lib/format-national-id'
import { useAuthStore } from '../../stores/auth-store'
import { testIDs } from '../../utils/test-ids'
import { getRightButtons } from '../../utils/get-main-root'
import { isIos } from '../../utils/devices'

const Row = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing[1]}px;
  column-gap: ${({ theme }) => theme.spacing[2]}px;
  flex-direction: row;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl, initialized) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'profile.screenTitle' }),
        },
        rightButtons: initialized
          ? getRightButtons({ icons: ['settings'], theme: theme as any })
          : [],
      },
      bottomTab: {
        iconColor: theme.color.blue400,
        text: initialized
          ? intl.formatMessage({ id: 'profile.bottomTabText' })
          : '',
      },
    }),
    {
      topBar: {
        largeTitle: {
          visible: true,
        },
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_MORE,
        iconInsets: {
          bottom: -4,
        },
        icon: require('../../assets/icons/tabbar-more.png'),
        selectedIcon: require('../../assets/icons/tabbar-more.png'),
      },
    },
  )

export const MoreScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)
  const authStore = useAuthStore()
  const intl = useIntl()
  const theme = useTheme()
  const [hiddenContent, setHiddenContent] = useState(isIos)

  useConnectivityIndicator({
    componentId,
    rightButtons: getRightButtons({ icons: ['settings'] }),
  })

  useNavigationComponentDidAppear(() => {
    setHiddenContent(false)
  }, componentId)

  // Fix for a bug in react-native-navigation where the large title is not visible on iOS with bottom tabs https://github.com/wix/react-native-navigation/issues/6717
  if (hiddenContent) {
    return null
  }

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <SafeAreaView style={{ marginBottom: theme.spacing[1] }}>
          <TouchableHighlight
            underlayColor={
              theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
            }
            onPress={() => {
              navigateTo('/personalinfo')
            }}
          >
            <FamilyMemberCard
              name={authStore.userInfo?.name ?? ''}
              nationalId={formatNationalId(authStore.userInfo?.nationalId)}
            />
          </TouchableHighlight>
        </SafeAreaView>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.family' })}
            icon={familyIcon}
            onPress={() => navigateTo('/family')}
            testID={testIDs.MORE_CARD_FAMILY}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.vehicles' })}
            icon={vehicleIcon}
            onPress={() => navigateTo('/vehicles')}
            testID={testIDs.MORE_CARD_VEHICLES}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.assets' })}
            icon={assetsIcon}
            onPress={() => navigateTo('/assets')}
            testID={testIDs.MORE_CARD_ASSETS}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.finance' })}
            icon={financeIcon}
            onPress={() => navigateTo('/finance')}
            testID={testIDs.MORE_CARD_FINANCE}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.health' })}
            icon={healthIcon}
            onPress={() => navigateTo('/health-overview')}
            testID={testIDs.MORE_CARD_HEALTH}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.airDiscount' })}
            icon={airplaneIcon}
            onPress={() => navigateTo('/air-discount')}
            testID={testIDs.MORE_CARD_AIR_DISCOUNT}
          />
        </Row>
      </ScrollView>
      <BottomTabsIndicator index={4} total={5} />
    </>
  )
}

MoreScreen.options = getNavigationOptions

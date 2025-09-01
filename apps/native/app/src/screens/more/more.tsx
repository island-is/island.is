import React from 'react'
import { useIntl } from 'react-intl'
import { SafeAreaView, ScrollView, TouchableHighlight } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import airplaneIcon from '../../assets/icons/airplane.png'
import assetsIcon from '../../assets/icons/assets.png'
import familyIcon from '../../assets/icons/family.png'
import financeIcon from '../../assets/icons/finance.png'
import healthIcon from '../../assets/icons/health.png'
import vehicleIcon from '../../assets/icons/vehicle.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { formatNationalId } from '../../lib/format-national-id'
import { useAuthStore } from '../../stores/auth-store'
import { FamilyMemberCard, MoreCard } from '../../ui'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'

const Row = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing[1]}px;
  column-gap: ${({ theme }) => theme.spacing[2]}px;
  flex-direction: row;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'profile.screenTitle' }),
        },
        rightButtons: getRightButtons({ icons: ['settings'], theme }),
      },
      bottomTab: {
        iconColor: theme.color.blue400,
        text: intl.formatMessage({ id: 'profile.bottomTabText' }),
      },
    }),
    {
      topBar: {
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
        },
      },
      bottomTab: {
        testID: testIDs.TABBAR_TAB_PROFILE,
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

  useConnectivityIndicator({
    componentId,
    rightButtons: getRightButtons({ icons: ['settings'] }),
  })

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
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.vehicles' })}
            icon={vehicleIcon}
            onPress={() => navigateTo('/vehicles')}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.assets' })}
            icon={assetsIcon}
            onPress={() => navigateTo('/assets')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.finance' })}
            icon={financeIcon}
            onPress={() => navigateTo('/finance')}
          />
        </Row>
        <Row>
          <MoreCard
            title={intl.formatMessage({ id: 'profile.health' })}
            icon={healthIcon}
            onPress={() => navigateTo('/health-overview')}
          />
          <MoreCard
            title={intl.formatMessage({ id: 'profile.airDiscount' })}
            icon={airplaneIcon}
            onPress={() => navigateTo('/air-discount')}
          />
        </Row>
      </ScrollView>
      <BottomTabsIndicator index={4} total={5} />
    </>
  )
}

MoreScreen.options = getNavigationOptions

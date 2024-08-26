import { FamilyMemberCard, ListButton } from '@ui'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Image,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks'
import styled, { useTheme } from 'styled-components/native'
import assetsIcon from '../../assets/icons/assets.png'
import familyIcon from '../../assets/icons/family.png'
import financeIcon from '../../assets/icons/finance.png'
import vehicleIcon from '../../assets/icons/vehicle.png'
import airplaneIcon from '../../assets/icons/airplane.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { formatNationalId } from '../../lib/format-national-id'
import { useAuthStore } from '../../stores/auth-store'
import { testIDs } from '../../utils/test-ids'
import { getRightButtons } from '../../utils/get-main-root'
import { isIos } from '../../utils/devices'

const Row = styled.View`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  margin-left: -${({ theme }) => theme.spacing[2]}px;
  margin-right: -${({ theme }) => theme.spacing[2]}px;
  flex-direction: column;
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
  const [hiddenContent, setHiddenContent] = useState(isIos)
  const showFinances = useFeatureFlag('isFinancesEnabled', false)
  const showAirDiscount = useFeatureFlag('isAirDiscountEnabled', false)

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
        <SafeAreaView>
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
          <ListButton
            title={intl.formatMessage({ id: 'profile.family' })}
            onPress={() => navigateTo(`/family`)}
            icon={
              <Image
                source={familyIcon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            }
          />
          <ListButton
            title={intl.formatMessage({ id: 'profile.vehicles' })}
            onPress={() => navigateTo(`/vehicles`)}
            icon={
              <Image
                source={vehicleIcon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            }
          />
          <ListButton
            title={intl.formatMessage({ id: 'profile.assets' })}
            onPress={() => navigateTo(`/assets`)}
            icon={
              <Image
                source={assetsIcon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            }
          />
          {showFinances && (
            <ListButton
              title={intl.formatMessage({ id: 'profile.finance' })}
              onPress={() => navigateTo(`/finance`)}
              icon={
                <Image
                  source={financeIcon}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              }
            />
          )}
          {showAirDiscount && (
            <ListButton
              title={intl.formatMessage({ id: 'profile.airDiscount' })}
              onPress={() => navigateTo(`/air-discount`)}
              icon={
                <Image
                  source={airplaneIcon}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              }
            />
          )}
        </Row>
      </ScrollView>
      <BottomTabsIndicator index={4} total={5} />
    </>
  )
}

MoreScreen.options = getNavigationOptions

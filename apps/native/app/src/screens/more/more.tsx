import React, { useRef } from 'react'
import { useIntl } from 'react-intl'
import { Animated, SafeAreaView, TouchableHighlight, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import airplaneIcon from '../../assets/icons/airplane.png'
import assetsIcon from '../../assets/icons/assets.png'
import familyIcon from '../../assets/icons/family.png'
import financeIcon from '../../assets/icons/finance.png'
import healthIcon from '../../assets/icons/health.png'
import vehicleIcon from '../../assets/icons/vehicle.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { MoreInfoContiner } from '../../components/more-info-container/more-info-container'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { formatNationalId } from '../../lib/format-national-id'
import { useMyPagesLinks } from '../../lib/my-pages-links'
import { useAuthStore } from '../../stores/auth-store'
import { FamilyMemberCard, MoreCard, TopLine } from '../../ui'
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

  const intl = useIntl()
  const theme = useTheme()
  const authStore = useAuthStore()
  const myPagesLinks = useMyPagesLinks()
  const scrollY = useRef(new Animated.Value(0)).current
  useConnectivityIndicator({
    componentId,
    rightButtons: getRightButtons({ icons: ['settings'] }),
  })

  const externalLinks = [
    {
      link: myPagesLinks.accessControl,
      title: intl.formatMessage({ id: 'profile.accessControl' }),
      icon: require('../../assets/icons/lock.png'),
    },
    {
      link: myPagesLinks.supportPayments,
      title: intl.formatMessage({ id: 'profile.supportPayments' }),
      icon: require('../../assets/icons/cardSuccess.png'),
    },
    {
      link: myPagesLinks.education,
      title: intl.formatMessage({ id: 'profile.education' }),
      icon: require('../../assets/icons/education.png'),
    },
    {
      link: myPagesLinks.lawAndOrder,
      title: intl.formatMessage({ id: 'profile.lawAndOrder' }),
      icon: require('../../assets/icons/lawAndOrder.png'),
    },
    {
      link: myPagesLinks.occupationalLicenses,
      title: intl.formatMessage({ id: 'profile.occupationalLicenses' }),
      icon: require('../../assets/icons/scroll.png'),
    },
  ]

  return (
    <>
      <Animated.ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
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
        <View
          style={{
            marginTop: theme.spacing[3],
          }}
        >
          <View style={{ paddingBottom: theme.spacing[4] }}>
            <MoreInfoContiner
              externalLinks={externalLinks}
              componentId={componentId}
            />
          </View>
        </View>
      </Animated.ScrollView>
      <TopLine scrollY={scrollY} />
      <BottomTabsIndicator index={4} total={5} />
    </>
  )
}

MoreScreen.options = getNavigationOptions

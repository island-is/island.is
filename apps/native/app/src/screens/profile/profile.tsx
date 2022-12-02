import { Heading, IconButton, UserCard } from '@island.is/island-ui-native'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { navigateTo } from '../../lib/deep-linking'
import { useAuthStore } from '../../stores/auth-store'
import { testIDs } from '../../utils/test-ids'
import familyIcon from '../../assets/icons/family.png'
import vehicleIcon from '../../assets/icons/vehicle.png'
import assetsIcon from '../../assets/icons/assets.png'
import { useIntl } from 'react-intl'
import { ButtonRegistry } from '../../utils/component-registry'
import { formatNationalId } from './tab-personal-info'

const Row = styled.View`
  flex-direction: row;
`

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'profile.screenTitle' }),
      },
      rightButtons: initialized ? [{
        accessibilityLabel: 'Settings',
        id: ButtonRegistry.SettingsButton,
        testID: testIDs.TOPBAR_SETTINGS_BUTTON,
        icon: require('../assets/icons/settings.png'),
        iconInsets: {
          left: 8,
        },
        iconBackground: {
          color: 'transparent',
          cornerRadius: 8,
          width: 32,
          height: 32,
        },
      }] : [],


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
      icon: require('../../assets/icons/tabbar-profile.png'),
      selectedIcon: require('../../assets/icons/tabbar-profile-selected.png'),
    },
  },
)

export const ProfileScreen: NavigationFunctionComponent = ({ componentId }) => {
  const authStore = useAuthStore()
  const intl = useIntl();
  useNavigationOptions(componentId)
  return (
    <>
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16 }}>
       <UserCard
        name={authStore.userInfo?.name}
        ssn={formatNationalId(String(authStore.userInfo?.nationalId))}
        actions={[
          { text: intl.formatMessage({ id: 'profile.seeInfo' }), onPress: () => navigateTo(`/personalinfo`) },
        ]}
       />

      <Heading>
        {intl.formatMessage({ id: 'profile.infoHeading' })}
      </Heading>
      <Row>
        {/* <IconButton
          title={intl.formatMessage({ id: 'profile.family' })}
          image={<Image source={familyIcon as any} style={{ width: 28, height: 20 }} /> }
          style={{ marginRight: 8}}
        /> */}
        <IconButton
          title={intl.formatMessage({ id: 'profile.vehicles' })}
          onPress={() => navigateTo(`/vehicles`)}
          image={<Image source={vehicleIcon as any} style={{ width: 24, height: 20 }} /> }
          style={{ marginRight: 8 }}
        />
        <IconButton
          title={intl.formatMessage({ id: 'profile.assets' })}
          onPress={() => navigateTo(`/assets`)}
          image={<Image source={assetsIcon as any}
          style={{ width: 30, height: 28 }} /> }
        />
      </Row>

    </ScrollView>
    <BottomTabsIndicator index={4} total={5} />
    </>
  )
}

ProfileScreen.options = getNavigationOptions

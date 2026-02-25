import { NativeTabs } from 'expo-router/unstable-native-tabs'
import React, { useEffect, useState } from 'react'

import { Redirect, usePathname } from 'expo-router'
import { usePreferencesStore } from '@/stores/preferences-store'
import { isOnboarded } from '@/utils/onboarding'
import { blue100, blue400 } from '../../../ui'
import { Image, Platform, StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components'
import { useIntl } from 'react-intl'

export default function TabLayout() {
  const intl = useIntl()
  const theme = useTheme()
  const hasOnboardedPinCode = usePreferencesStore((s) => s.hasOnboardedPinCode)
  const hasOnboardedBiometrics = usePreferencesStore(
    (s) => s.hasOnboardedBiometrics,
  )
  const hasOnboardedNotifications = usePreferencesStore(
    (s) => s.hasOnboardedNotifications,
  )

  const onboarded = isOnboarded()

  if (!onboarded) {
    if (!hasOnboardedPinCode) {
      return <Redirect href="/(auth)/onboarding/pin" />
    } else if (!hasOnboardedBiometrics) {
      return <Redirect href="/(auth)/onboarding/biometrics" />
    } else if (!hasOnboardedNotifications) {
      return <Redirect href="/(auth)/onboarding/notifications" />
    }
  }
  return (
    <>
      <NativeTabs
        labelVisibilityMode="labeled"
        backgroundColor={
          Platform.OS === 'android' ? theme.shade.background : undefined
        }
        labelStyle={{
          fontFamily: 'IBMPlexSans_400Regular',
          fontSize: 11,
          selected: {
            color: blue400,
          },
        }}
        iconColor={blue400}
      >
        <NativeTabs.Trigger name="inbox">
          <NativeTabs.Trigger.Label>
            {intl.formatMessage({ id: 'inbox.bottomTabText' })}
          </NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={{
              default: require('@/assets/icons/tabbar-mail.png'),
              selected: require('@/assets/icons/tabbar-mail-selected.png'),
            }}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="wallet">
          <NativeTabs.Trigger.Label>
            {intl.formatMessage({ id: 'wallet.bottomTabText' })}
          </NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={{
              default: require('@/assets/icons/tabbar-wallet.png'),
              selected: require('@/assets/icons/tabbar-wallet-selected.png'),
            }}
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label hidden={Platform.OS === 'ios'}>
            {intl.formatMessage({ id: 'home.screenTitle' })}
          </NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={{
              default: require('@/assets/icons/home-icon-inactive.png'),
              selected: require('@/assets/icons/home-icon-active.png'),
            }}
            renderingMode="original"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="health">
          <NativeTabs.Trigger.Label>
            {intl.formatMessage({ id: 'health.overview.screenTitle' })}
          </NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={{
              default: require('@/assets/icons/tabbar-health.png'),
              selected: require('@/assets/icons/tabbar-health-selected.png'),
            }}
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="more">
          <NativeTabs.Trigger.Label>
            {intl.formatMessage({ id: 'profile.screenTitle' })}
          </NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require('@/assets/icons/tabbar-more.png')}
          />
        </NativeTabs.Trigger>
      </NativeTabs>
      {/* @todo migration We can draw over the tabbar on android */}
      {/* <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View
          style={{
            width: 100,
            height: 65,
            backgroundColor: '#fff',
            bottom: 60,
            left: '50%',
            transform: [{ translateX: -50 }],
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            source={require('@/assets/icons/home-icon-active.png')}
          />
        </View>
      </View> */}
    </>
  )
}

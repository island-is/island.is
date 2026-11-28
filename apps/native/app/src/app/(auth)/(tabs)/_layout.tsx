import { NativeTabs } from 'expo-router/unstable-native-tabs'
import React, { useState } from 'react'

import { Redirect, useNavigation, usePathname } from 'expo-router'
import { useAuthStore } from '@/stores/auth-store'
import { usePreferencesStore } from '@/stores/preferences-store'
import { getUnfinishedOnboardingStep } from '@/utils/onboarding'
import { theme } from '../../../ui'
import { Image, Platform, StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components'
import { useIntl } from 'react-intl'
import { uiStore, useUiStore } from '../../../stores/ui-store'

export const unstable_settings = {
  initialRouteName: 'index',
}

// Shows what's left of onboarding after an unlock.
function ResumeOnboarding({
  step,
}: {
  step: 'biometrics' | 'notifications' | 'privacy'
}) {
  return <Redirect href={`/(auth)/onboarding/${step}`} />
}

export default function TabLayout() {
  const intl = useIntl()
  const tabsHidden = useUiStore((s) => s.tabsHidden)
  // Read here so a finished step re-renders the tabs.
  usePreferencesStore((s) => s.hasOnboardedBiometrics)
  usePreferencesStore((s) => s.hasOnboardedNotifications)
  usePreferencesStore((s) => s.hasOnboardedPrivacy)
  useUiStore((s) => s.authenticationTypes.length)
  useUiStore((s) => s.hasStrongBiometricHardware)
  const isLocked = useAuthStore((s) => s.lockScreenActivatedAt !== undefined)
  const isSignedIn = useAuthStore((s) => !!s.nativeUser)
  const isOnboarding = usePathname().startsWith('/onboarding')

  // A login runs the whole onboarding (nextOnboardingStep), and these tabs
  // wait under it: they'd otherwise skip its steps.
  if (isOnboarding) {
    return null
  }

  // Someone who left part way through gets the rest after an unlock. Not
  // while locked: a Redirect replaces the top screen, which is the lock. Not
  // after logging out either, which resets the steps while these tabs are
  // still up.
  const unfinishedStep =
    isLocked || !isSignedIn ? null : getUnfinishedOnboardingStep()
  if (unfinishedStep) {
    return <ResumeOnboarding step={unfinishedStep} />
  }

  return (
    <>
      <NativeTabs
        // NativeTabs ignores `unstable_settings.initialRouteName`, so the
        // default 'initialRoute' back behavior lands on the first trigger.
        backBehavior="history"
        labelVisibilityMode="labeled"
        backgroundColor={
          Platform.OS === 'android' ? theme.tokens.background.invert : undefined
        }
        indicatorColor="#e4e4f0"
        labelStyle={{
          fontFamily: 'IBMPlexSans_400Regular',
          fontSize: 11,
          color: theme.tokens.foreground.primary,
          selected: {
            color: theme.tokens.interactive.foreground.primary,
          },
          default: {
            color: theme.tokens.foreground.primary,
          },
        }}
        iconColor={theme.tokens.interactive.foreground.primary}
        hidden={tabsHidden}
        screenListeners={{
          tabPress: (e) => uiStore.setState({ focusedTab: e.target }),
        }}
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
            renderingMode="original"
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
            renderingMode="original"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label
            hidden={Platform.OS === 'ios' && !Platform.isPad}
          >
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
            renderingMode="original"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="more">
          <NativeTabs.Trigger.Label>
            {intl.formatMessage({ id: 'profile.screenTitle' })}
          </NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={require('@/assets/icons/tabbar-more.png')}
            renderingMode="original"
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

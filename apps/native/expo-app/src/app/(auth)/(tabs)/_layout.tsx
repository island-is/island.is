import { NativeTabs } from 'expo-router/unstable-native-tabs'
import React, { useEffect, useState } from 'react'

import { Redirect, usePathname } from 'expo-router'
import { usePreferencesStore } from '@/stores/preferences-store'
import { isOnboarded } from '@/utils/onboarding'
import { blue400 } from '../../../ui'

export default function TabLayout() {
  const hasOnboardedPinCode = usePreferencesStore((s) => s.hasOnboardedPinCode)
  const hasOnboardedBiometrics = usePreferencesStore(
    (s) => s.hasOnboardedBiometrics,
  )
  const hasOnboardedNotifications = usePreferencesStore(
    (s) => s.hasOnboardedNotifications,
  )
  const route = usePathname()
  const [vis, setVis] = useState(true)

  const onboarded = isOnboarded()

  if (!onboarded) {
    return <Redirect href="/(auth)/onboarding" />
  }

  useEffect(() => {
    if (route.includes('inbox/') && route !== '/inbox/filter') {
      setTimeout(() => setVis(false), 100)
    } else {
      setVis(true)
    }
  }, [route])

  return (
    <NativeTabs hidden={!vis} labelStyle={{
      fontFamily: 'IBMPlexSans_400Regular',
      fontSize: 12,
      selected: {
        color: blue400,
      }
    }}>
      <NativeTabs.Trigger name="inbox">
        <NativeTabs.Trigger.Label>Pósthólf</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/icons/tabbar-mail.png'),
            selected: require('@/assets/icons/tabbar-mail-selected.png'),
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="two">
        <NativeTabs.Trigger.Label>Skírteini</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/icons/tabbar-wallet.png'),
            selected: require('@/assets/icons/tabbar-wallet-selected.png'),
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label hidden>Heim</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/icons/home-icon-inactive.png'),
            selected: require('@/assets/icons/home-icon-active.png'),
          }}
          renderingMode="original"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="three">
        <NativeTabs.Trigger.Label>Umsóknir</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: require('@/assets/icons/tabbar-applications.png'),
            selected: require('@/assets/icons/tabbar-applications-selected.png'),
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="more">
        <NativeTabs.Trigger.Label>Meira</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/icons/tabbar-more.png')}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}

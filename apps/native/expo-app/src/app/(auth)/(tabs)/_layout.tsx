import FontAwesome from '@expo/vector-icons/FontAwesome'
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import React, { useEffect, useState } from 'react'

import { Redirect, usePathname } from 'expo-router'
import { useAuthStore } from '../../../stores/_mock-auth'

export default function TabLayout() {
  const isOnboarded = useAuthStore((s) => s.hasOnboarded)
  const route = usePathname()
  const [vis, setVis] = useState(true)

  if (!isOnboarded) {
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
    <NativeTabs
      hidden={!vis}

      // backgroundColor={Colors.background}
      // indicatorColor={colors.backgroundElement}
      // labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="inbox">
        <NativeTabs.Trigger.Label>Pósthólf</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/icons/tabbar-mail.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="two">
        <NativeTabs.Trigger.Label>Skírteini</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/icons/tabbar-wallet.png')}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label hidden />
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

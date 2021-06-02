import {
  Close,
  Heading,
  ViewPager,
  WelcomeCard,
} from '@island.is/island-ui-native'
import React from 'react'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'
import illustrationDarkSrc from '../../assets/illustrations/digital-services-m2-dark.png'
import illustrationSrc from '../../assets/illustrations/digital-services-m2.png'
import { authStore, useAuthStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { useIntl } from '../../utils/intl'

export const OnboardingModule = React.memo(() => {
  const theme = useTheme()
  const intl = useIntl()
  const { dismissed, dismiss } = usePreferencesStore()
  const { userInfo } = useAuthStore();

  if (dismissed.includes('onboardingWidget')) {
    return null
  }

  return (
    <SafeAreaView style={{ marginHorizontal: 16, marginTop: 16 }}>
      <Heading
        button={
          <TouchableOpacity onPress={() => dismiss('onboardingWidget')}>
            <Close />
          </TouchableOpacity>
        }
      >
        {intl.formatMessage({ id: 'home.welcomeText' })}{' '}
        {userInfo?.name.split(' ').shift()}
      </Heading>
      <ViewPager>
        <WelcomeCard
          key="card-1"
          number="1"
          description={intl.formatMessage({ id: 'home.onboardingModule.card1' })}
          imgSrc={theme.isDark ? illustrationDarkSrc : illustrationSrc}
          backgroundColor={{
            dark: '#2A1240',
            light: theme.color.purple100,
          }}
        />
        <WelcomeCard
          key="card-2"
          number="2"
          description={intl.formatMessage({ id: 'home.onboardingModule.card2' })}
          imgSrc={theme.isDark ? illustrationDarkSrc : illustrationSrc}
          backgroundColor={{
            dark: '#1C1D53',
            light: theme.color.blue100,
          }}
        />
        <WelcomeCard
          key="card-3"
          number="3"
          description={intl.formatMessage({ id: 'home.onboardingModule.card3' })}
          imgSrc={theme.isDark ? illustrationDarkSrc : illustrationSrc}
          backgroundColor={{
            dark: '#3E002E',
            light: theme.color.red100,
          }}
        />
      </ViewPager>
    </SafeAreaView>
  )
});

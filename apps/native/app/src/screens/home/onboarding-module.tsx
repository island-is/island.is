import { Close, Heading, ViewPager, WelcomeCard } from '@ui'
import React from 'react'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'
import illustration1 from '../../assets/illustrations/digital-services-m3.png'
import illustration3 from '../../assets/illustrations/le-company-s2.png'
import illustration2 from '../../assets/illustrations/le-retirement-s3.png'
import illustration4 from '../../assets/illustrations/le_jobs_s5.png'

import { useIntl } from 'react-intl'
import { useAuthStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'

export const OnboardingModule = React.memo(() => {
  const theme = useTheme()
  const intl = useIntl()
  const { dismissed, dismiss } = usePreferencesStore()
  const { userInfo } = useAuthStore()

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
        {userInfo?.name?.split(' ').shift()}
      </Heading>
      <ViewPager>
        <WelcomeCard
          key="card-1"
          description={intl.formatMessage({
            id: 'home.onboardingModule.card1',
          })}
          imgSrc={illustration1}
          grid
          backgroundColor={{
            dark: '#150920',
            light: theme.color.purple100,
          }}
        />
        <WelcomeCard
          key="card-2"
          description={intl.formatMessage({
            id: 'home.onboardingModule.card2',
          })}
          imgSrc={illustration2}
          backgroundColor={{
            dark: '#150920',
            light: theme.color.purple100,
          }}
        />
        <WelcomeCard
          key="card-3"
          description={intl.formatMessage({
            id: 'home.onboardingModule.card3',
          })}
          imgSrc={illustration3}
          backgroundColor={{
            dark: '#150920',
            light: theme.color.purple100,
          }}
          link={{ url: 'mailto:island@island.is', title: 'island@island.is' }}
        />
        <WelcomeCard
          key="card-4"
          description={intl.formatMessage({
            id: 'home.onboardingModule.card4',
          })}
          imgSrc={illustration4}
          backgroundColor={{
            dark: '#150920',
            light: theme.color.purple100,
          }}
          link={{
            url: 'https://island.is/personuverndarstefna-stafraent-islands',
            title: 'Ísland.is',
          }}
        />
      </ViewPager>
    </SafeAreaView>
  )
})

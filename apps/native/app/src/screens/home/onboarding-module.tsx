import React from 'react'
import { useIntl } from 'react-intl'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'

import illustration1 from '../../assets/illustrations/digital-services-m3.png'
import illustration3 from '../../assets/illustrations/le-company-s2.png'
import illustration2 from '../../assets/illustrations/le-retirement-s3-large.png'
import illustration4 from '../../assets/illustrations/le_jobs_s5.png'
import { DISMISSED_KEYS } from '../../constants/dissmissed-keys'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import { useAuthStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { Close, Heading, ViewPager, WelcomeCard } from '../../ui'
import { HomeBanner } from './home-banner'

export const OnboardingModule = React.memo(() => {
  const theme = useTheme()
  const intl = useIntl()
  const { dismissed, dismiss } = usePreferencesStore()
  const { userInfo } = useAuthStore()
  const isHomeBannerEnabled = useFeatureFlag('isHomeBannerEnabled', false)

  return (
    <SafeAreaView style={{ marginHorizontal: 16, marginTop: 16 }}>
      {!dismissed.includes(DISMISSED_KEYS.ONBOARDING_WIDGET) && (
        <>
          <Heading
            button={
              <TouchableOpacity
                onPress={() => dismiss(DISMISSED_KEYS.ONBOARDING_WIDGET)}
              >
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
        </>
      )}
      <HomeBanner
        visible={
          isHomeBannerEnabled &&
          !dismissed.includes(DISMISSED_KEYS.KILOMETER_ANNOUNCEMENT)
        }
        onClose={() => dismiss(DISMISSED_KEYS.KILOMETER_ANNOUNCEMENT)}
      />
    </SafeAreaView>
  )
})

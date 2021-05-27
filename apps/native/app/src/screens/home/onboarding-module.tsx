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
import { authStore } from '../../stores/auth-store'
import { usePreferencesStore } from '../../stores/preferences-store'
import { useIntl } from '../../utils/intl'

export const OnboardingModule = React.memo(() => {
  const theme = useTheme()
  const intl = useIntl()
  const { dismissed, dismiss } = usePreferencesStore()

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
        {authStore.getState().userInfo?.name.split(' ').shift()}
      </Heading>
      <ViewPager>
        <WelcomeCard
          key="card-1"
          number="1"
          description="Í þessari fyrstu útgáfu af Ísland.is appinu getur þú nálgast rafræn skjöl og skírteini frá hinu opinbera, fengið tilkynningar og séð stöðu umsókna."
          imgSrc={theme.isDark ? illustrationDarkSrc : illustrationSrc}
          backgroundColor={theme.isDark ? '#2A1240' : theme.color.purple100}
        />
        <WelcomeCard
          key="card-2"
          number="2"
          description="Markmiðið með appinu er að þú hafir í hendi þér það sem þú þarfnast hverju sinni í samskiptum við hið opinbera."
          imgSrc={theme.isDark ? illustrationDarkSrc : illustrationSrc}
          backgroundColor={theme.isDark ? '#1C1D53' : theme.color.blue100}
        />
        <WelcomeCard
          key="card-3"
          number="3"
          description="Hafir þú athugasemdir eða ábendingar um eitthvað sem vantar eða sem má betur fara viljum við gjarnan fá frá þér línu á island@island.is"
          imgSrc={theme.isDark ? illustrationDarkSrc : illustrationSrc}
          backgroundColor={theme.isDark ? '#3E002E' : theme.color.red100}
        />
      </ViewPager>
    </SafeAreaView>
  )
});

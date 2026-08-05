import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { openBrowserAsync } from 'expo-web-browser'

import { Button, Onboarding } from '@/ui'
import onboardingPrivacy from '@/assets/illustrations/onboarding-privacy.png'
import { preferencesStore } from '@/stores/preferences-store'
import { nextOnboardingStep } from '@/utils/onboarding'

const PRIVACY_URL = 'https://island.is/personuverndarstefna-stafraent-islands'

export default function PrivacyScreen() {
  const intl = useIntl()

  const onContinuePress = () => {
    preferencesStore.setState({ hasOnboardedPrivacy: true })
    nextOnboardingStep()
  }

  return (
    <Onboarding
      illustration={onboardingPrivacy}
      title={<FormattedMessage id="onboarding.privacy.title" />}
      body={<FormattedMessage id="onboarding.privacy.body" />}
      link={{
        title: <FormattedMessage id="onboarding.privacy.linkText" />,
        onPress: () => openBrowserAsync(PRIVACY_URL),
      }}
      buttonSubmit={
        <Button
          title={intl.formatMessage({
            id: 'onboarding.privacy.continueButtonText',
          })}
          onPress={onContinuePress}
        />
      }
    />
  )
}

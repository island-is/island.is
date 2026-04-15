import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Button } from '../button/button'
import { Onboarding } from './onboarding'

import onboardingBiometrics from '../../../assets/illustrations/onboarding-biometrics.png'
import onboardingNotifications from '../../../assets/illustrations/onboarding-notifications.png'
import onboardingPrivacy from '../../../assets/illustrations/onboarding-privacy.png'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, width: '100%' }}>{children}</View>
)

const noop = () => undefined

storiesOf('Onboarding', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .add('Biometrics', () => (
    <Onboarding
      illustration={onboardingBiometrics}
      title="Leyfa lífkenni"
      body="Þú getur einnig notað Face ID til að opna appið án þess að slá inn PIN."
      buttonSubmit={<Button title="Leyfa lífkenni" onPress={noop} />}
      buttonCancel={
        <Button title="Sleppa því í bili" isOutlined onPress={noop} />
      }
    />
  ))
  .add('Notifications', () => (
    <Onboarding
      illustration={onboardingNotifications}
      title="Leyfa tilkynningar"
      body="Fáðu tilkynningar um ný skjöl eða annað mikilvægt."
      buttonSubmit={<Button title="Leyfa tilkynningar" onPress={noop} />}
      buttonCancel={
        <Button title="Sleppa því í bili" isOutlined onPress={noop} />
      }
    />
  ))
  .add('Privacy', () => (
    <Onboarding
      illustration={onboardingPrivacy}
      title="Persónuvernd"
      body="Hægt er að kynna sér stefnu Stafræns Íslands um meðferð persónuupplýsinga á Ísland.is"
      link={{ title: 'Persónuverndastefna Ísland.is', onPress: noop }}
      buttonSubmit={<Button title="Halda áfram" onPress={noop} />}
    />
  ))

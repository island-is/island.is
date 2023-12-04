import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Button } from '../button/button'
import { CancelButton } from '../button/cancel-button'
import { Illustration } from '../illustration/illustration'
import { Onboarding } from './onboarding'

const CenterView = ({ children }: any) => (
  <View
    style={{
      flex: 1,
      width: '100%',
    }}
  >
    {children}
  </View>
)

storiesOf('Onboarding', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Notifications', () => {
    const title = text(
      'Notification Onboarding Title',
      'Fáðu tilkynningar um ný rafræn skjöl um leið og þau berast.',
    )
    return (
      <Onboarding
        illustration={<Illustration />}
        title={title}
        buttonSubmit={
          <Button
            title="Leyfa tilkynningar"
            onPress={() => console.log('Allow pressed')}
          />
        }
        buttonCancel={
          <CancelButton
            title="Ákveða seinna"
            onPress={() => console.log('Cancel pressed')}
          />
        }
      />
    )
  })
  .add('Biometrics', () => {
    const title = text(
      'Biometrics Onboarding Title',
      'Þú getur einnig notað FaceId til að opna appið án þess að slá inn PIN.',
    )
    return (
      <Onboarding
        illustration={<Illustration />}
        title={title}
        buttonSubmit={
          <Button
            title="Not FaceID"
            onPress={() => console.log('Allow pressed')}
          />
        }
        buttonCancel={
          <CancelButton
            title="Sleppa því í bili"
            onPress={() => console.log('Cancel pressed')}
          />
        }
      />
    )
  })

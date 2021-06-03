import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Button } from '../Button/Button'
import { CancelButton } from '../Button/CancelButton'
import { Close } from '../Button/Close'
import { Illustration } from '../Illustration/Illustration'
import { Onboarding } from './Onboarding'

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
    return (
      <Onboarding
        illustration={<Illustration />}
        title="Fáðu tilkynningar um ný rafræn skjöl um leið og þau berast."
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
    return (
      <Onboarding
        illustration={<Illustration />}
        title="Þú getur einnig notað FaceId til að opna appið án þess að slá inn PIN."
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

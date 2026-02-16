import { boolean, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { GenericLicenseType } from '../../../graphql/types/schema'
import { ScanResultCard } from './scan-result-card'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1 }}>{children}</View>
)

storiesOf('Scan Result Card', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const loading = boolean('Loading', false)
    const error = boolean('Error', false)
    const errorMessage = text('Error messsage', 'Ekki í gildi')
    const name = text('name', 'Jón Jónsson')
    const nationalId = text('nationalId', '1204862379')

    return (
      <View style={{ flex: 1, padding: 16 }}>
        <ScanResultCard
          loading={loading}
          error={error}
          errorMessage={errorMessage}
          name={name}
          nationalId={nationalId}
          type={GenericLicenseType.DriversLicense}
        />
      </View>
    )
  })

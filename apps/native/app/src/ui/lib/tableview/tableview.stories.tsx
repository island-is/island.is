import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { Platform, Switch, View } from 'react-native'
import { theme } from '../../utils/theme'
import { TableViewCell } from './tableview-cell'
import { TableViewGroup } from './tableview-group'

const CenterView = ({ children }: any) => (
  <View
    style={{
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </View>
)

storiesOf('Tableview', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Group With Cell And Switch', () => {
    return (
      <TableViewGroup header="Tilkynningar">
        <TableViewCell
          title="Fá tilkynningar um ný skjöl"
          accessory={
            <Switch
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
      </TableViewGroup>
    )
  })
  .add('Cell', () => {
    return (
      <View style={{ width: '100%' }}>
        <TableViewCell title="Version" />
      </View>
    )
  })
  .add('Cell With Subtitle', () => {
    return (
      <View style={{ width: '100%' }}>
        <TableViewCell title="Version" subtitle="1.0.0 build 9" />
      </View>
    )
  })
  .add('Cell With Subtitle And Switch', () => {
    return (
      <View style={{ width: '100%' }}>
        <TableViewCell
          title="Nota Face ID"
          subtitle="Möguleiki á að komast fyrr inn í appið"
          accessory={
            <Switch
              thumbColor={Platform.select({ android: theme.color.dark100 })}
              trackColor={{
                false: theme.color.dark200,
                true: theme.color.blue400,
              }}
            />
          }
        />
      </View>
    )
  })

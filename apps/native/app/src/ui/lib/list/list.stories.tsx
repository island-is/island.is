import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { Image, ImageSourcePropType, View } from 'react-native'
import agencyLogo from '../../assets/card/agency-logo.png'
import { ListItem } from './list-item'

const CenterView = ({ children }: any) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      width: '100%',
    }}
  >
    {children}
  </View>
)

storiesOf('List', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('List Item', () => {
    const title = text('List Item Title', 'Fjársýsla ríkisins')
    const subTitle = text('List Item Sub Title', 'Tilkynning um inneign')
    return (
      <ListItem
        title={title}
        subtitle={subTitle}
        date={new Date()}
        icon={
          <Image
            source={agencyLogo as ImageSourcePropType}
            resizeMode="contain"
            style={{ width: 25, height: 25 }}
          />
        }
      />
    )
  })

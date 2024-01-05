import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { Link } from './link'
import { LinkText } from './link-text'

const CenterView = ({ children }: any) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 16,
    }}
  >
    {children}
  </View>
)

storiesOf('Link', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const linkText = text('Link Text', 'island@island.is')
    return <Link url="mailto:island@island.is">{linkText}</Link>
  })
  .add('Link Text', () => {
    const linkText = text('LinkText Text', 'Umsóknir')
    return <LinkText>{linkText}</LinkText>
  })

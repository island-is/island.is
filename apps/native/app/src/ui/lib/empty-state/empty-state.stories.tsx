import { text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { Image, View } from 'react-native'

import { LinkText } from '../link/link-text'
import illustrationSrc from '../../assets/empty-list/LE-Company-S3.png'
import leJobss4 from '../../assets/illustrations/le-jobs-s4.png'
import { EmptyCard } from './empty-card'
import { EmptyList } from './empty-list'

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

storiesOf('Empty States', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const title = text('Empty List Title', 'Hér eru engin skjöl sem stendur')
    const description = text(
      'Empty List Description',
      'Þegar þú færð send rafræn skjöl frá hinu opinbera þá birtast þau hér.',
    )
    return (
      <EmptyList
        title={title}
        description={description}
        image={
          <Image source={illustrationSrc} style={{ width: 198, height: 146 }} />
        }
      />
    )
  })
  .add('Empty Card', () => {
    const description = text(
      'Empty Card Text',
      'Þegar þú stofnar stafræna umsókn á Ísland.is birtist staða hennar hér.',
    )
    return (
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <EmptyCard
          text={description}
          image={<Image source={leJobss4} style={{ width: 90, height: 42 }} />}
          link={<LinkText>Skoða umsóknir</LinkText>}
        />
      </View>
    )
  })

import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { Image, View } from 'react-native'
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

storiesOf('Empty List', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Deafult', () => {
    return (
      <EmptyList
        title="Hér eru engin skjöl sem stendur"
        description="Þegar þú færð send rafræn skjöl frá hinu opinbera þá birtast þau hér."
        image={<Image source={illustrationSrc} height={198} width={146} />}
      />
    )
  })
  .add('Empty Card', () => {
    return (
      <EmptyCard
        text="Þegar þú stofnar stafræna umsókn á Ísland.is birtist staða hennar hér."
        image={<Image source={leJobss4} height={90} width={42} />}
      />
    )
  })

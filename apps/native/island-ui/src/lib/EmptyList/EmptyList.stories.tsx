import { storiesOf } from '@storybook/react-native'
import { withKnobs } from '@storybook/addon-knobs';
import React from 'react'
import { View, Image } from 'react-native';
import { EmptyList } from './EmptyList';
import illustrationSrc from '../../assets/empty-list/LE-Company-S3.png'

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 16 }}>{children}</View>
)

storiesOf('Empty List', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Deafult', () => {
    return (
      <EmptyList
        title="Hér eru engin skjöl sem stendur"
        description="Þegar þú færð send rafræn skjöl frá hinu opinbera þá birtast þau hér."
        image={<Image source={illustrationSrc} height={198} width={146} />}
      />
    );
  })

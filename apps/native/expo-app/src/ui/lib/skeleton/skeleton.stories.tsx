import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { ListItemSkeleton } from './list-item-skeleton'
import { Skeleton } from './skeleton'
import { StatusCardSkeleton } from './status-card-skeleton'

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

storiesOf('Skeleton', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    return <Skeleton active style={{ borderRadius: 4 }} height={17} />
  })

storiesOf('Skeleton', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Status Card Skeleton', () => {
    return <StatusCardSkeleton />
  })

storiesOf('Skeleton', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('List Item Skeleton', () => {
    return <ListItemSkeleton />
  })

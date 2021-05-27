import { theme } from '@island.is/island-ui/theme'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { ImageSourcePropType, View } from 'react-native'
import illustrationSrc from '../../assets/card/digital-services-m2.png'
import { WelcomeCard } from '../Card/WelcomeCard'
import { ViewPager } from './ViewPager'


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

storiesOf('View Pager', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <View style={{ marginHorizontal: 16, width: '90%%' }}>
        <ViewPager>
          <WelcomeCard
            key="card-1"
            number="1"
            description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
            imgSrc={illustrationSrc as ImageSourcePropType}
            backgroundColor={theme.color.purple100}
          />
          <WelcomeCard
            key="card-2"
            number="2"
            description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
            imgSrc={illustrationSrc as ImageSourcePropType}
            backgroundColor={theme.color.blue100}
          />
          <WelcomeCard
            key="card-3"
            number="3"
            description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
            imgSrc={illustrationSrc as ImageSourcePropType}
            backgroundColor={theme.color.red100}
          />
        </ViewPager>
      </View>
    )
  })

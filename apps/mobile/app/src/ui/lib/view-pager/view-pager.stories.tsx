import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { ImageSourcePropType, View } from 'react-native'
import illustrationSrc from '../../assets/illustrations/digital-services-m3.png'
import { theme } from '../../utils/theme'
import { WelcomeCard } from '../card/welcome-card'
import { ViewPager } from './view-pager'

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
            description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
            imgSrc={illustrationSrc as ImageSourcePropType}
            backgroundColor={{
              dark: '#2A1240',
              light: theme.color.purple100,
            }}
          />
          <WelcomeCard
            key="card-2"
            description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
            imgSrc={illustrationSrc as ImageSourcePropType}
            backgroundColor={{
              dark: '#2A1240',
              light: theme.color.purple100,
            }}
          />
          <WelcomeCard
            key="card-3"
            description="Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna."
            imgSrc={illustrationSrc as ImageSourcePropType}
            backgroundColor={{
              dark: '#2A1240',
              light: theme.color.purple100,
            }}
          />
        </ViewPager>
      </View>
    )
  })

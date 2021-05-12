import { storiesOf } from '@storybook/react-native'
import { text, withKnobs } from '@storybook/addon-knobs';
import React from 'react'
import { ImageSourcePropType, View } from 'react-native';
import { WelcomeCard } from './WelcomeCard'
import { LicenceCard } from './LicenceCard';
import { NotificationCard } from './NotificationCard';
import { StatusCard } from './StatusCard';
import illustrationSrc from '../../assets/card/digital-services-m2.png'
import agencyLogo from '../../assets/card/agency-logo.png'
import logo from '../../assets/card/logo-64w.png'
import timeOutlineIcon from '../../assets/card/time-outline.png';
import { Badge } from '../Badge/Badge';

const CenterView = ({ children }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>{children}</View>
)

storiesOf('Cards', module)
  .addDecorator((getStory) => <CenterView>{ getStory() }</CenterView>)
  .addDecorator(withKnobs)
  .add('Welcome card', () => {
    const number = text('Number', '1');
    const description = text('Description', 'Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna.');
    return (
      <WelcomeCard
        number={number}
        description={description}
        imgSrc={illustrationSrc as ImageSourcePropType}
      />
    );
  })
  .add('Licence card', () => {
    return (
      <LicenceCard
        title="Ökuskýrteini"
        agencyLogo={agencyLogo as ImageSourcePropType}
      />
    );
  })
  .add('Notification card', () => {
    return (
      <NotificationCard
        id="demo"
        icon={logo as ImageSourcePropType}
        date={new Date()}
        title="Ökuskýrteini"
        message="Skýrteini frá Lögreglusjóra nú aðgengilegt í appinu"
        unread={false}
        onPress={() => console.log('test')}
      />
    );
  })
  .add('Status card', () => {
    return (
      <StatusCard
        title="Fæðingarorlof 4/6"
        icon={timeOutlineIcon}
        date={new Date()}
        description="Skipting orlofstíma"
        badge={<Badge title="Vantar gögn" />}
        progress={66}
        actions={[{ text: 'Opna umsókn', onPress() {} }]}
      />
    );
  })

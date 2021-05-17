import { storiesOf } from '@storybook/react-native'
import { text, withKnobs, boolean, number } from '@storybook/addon-knobs';
import React from 'react'
import { ImageSourcePropType, View } from 'react-native';
import { WelcomeCard } from './WelcomeCard'
import { LicenceCard } from './LicenceCard';
import { NotificationCard } from './NotificationCard';
import { StatusCard } from './StatusCard';
import illustrationSrc from '../../assets/card/digital-services-m2.png'
import agencyLogo from '../../assets/card/agency-logo.png'
import logo from '../../assets/card/logo-64w.png'

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
  .add('Licence Card', () => {
    const title = text('Licence Card Title', 'Ökuskýrteini');
    return (
      <LicenceCard
        title={title}
        status="Í gildi"
        date="16:24 - 14.03.2022"
        agencyLogo={agencyLogo as ImageSourcePropType}
      />
    );
  })
  .add('Notification Card', () => {
    const title = text('Notification Card Title', 'Ökuskýrteini');
    const message = text('Notification Card Message', 'Skýrteini frá Lögreglusjóra nú aðgengilegt í appinu');
    return (
      <NotificationCard
        id="story-demo"
        icon={logo as ImageSourcePropType}
        date={new Date()}
        title={title}
        message={message}
        unread={boolean('Is Unread', true)}
        onPress={() => console.log('test')}
      />
    );
  })
  .add('Status Card', () => {
    const title = text('Status Card Title', 'Fæðingarorlof 1/3');
    const description = text('Status Card Description', 'Skipting orlofstíma');
    const badgeTitle = text('Badge Status Card Title', 'Vantar gögn');
    const options = {
      range: true,
      min: 0,
      max: 100,
      step: 20,
    };
    const progress = number('Status Card Progess', 66, options);
    return (
      <StatusCard
        title={title}
        date={new Date()}
        description={description}
        badge={<Badge title={badgeTitle} />}
        progress={progress}
        actions={[{ text: 'Opna umsókn', onPress() {} }]}
      />
    );
  })

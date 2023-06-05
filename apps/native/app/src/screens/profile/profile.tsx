import {Heading, IconButton, UserCard} from '@ui';
import React from 'react';
import {Image, SafeAreaView, ScrollView} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import styled from 'styled-components/native';
import {BottomTabsIndicator} from '../../components/bottom-tabs-indicator/bottom-tabs-indicator';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {navigateTo} from '../../lib/deep-linking';
import {useAuthStore} from '../../stores/auth-store';
import {testIDs} from '../../utils/test-ids';
import familyIcon from '../../assets/icons/family.png';
import vehicleIcon from '../../assets/icons/vehicle.png';
import assetsIcon from '../../assets/icons/assets.png';
import {useIntl} from 'react-intl';
import {formatNationalId} from './tab-personal-info';
import {getRightButtons} from '../../utils/get-main-root';

const Row = styled.View`
  flex-direction: row;
`;

const {
  useNavigationOptions,
  getNavigationOptions,
} = createNavigationOptionHooks(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({id: 'profile.screenTitle'}),
      },
      rightButtons: initialized ? getRightButtons({theme} as any) : [],
    },
    bottomTab: {
      iconColor: theme.color.blue400,
      text: initialized
        ? intl.formatMessage({id: 'profile.bottomTabText'})
        : '',
    },
  }),
  {
    topBar: {
      largeTitle: {
        visible: true,
      },
      scrollEdgeAppearance: {
        active: true,
        noBorder: true,
      },
    },
    bottomTab: {
      testID: testIDs.TABBAR_TAB_PROFILE,
      iconInsets: {
        bottom: -4,
      },
      icon: require('../../assets/icons/tabbar-profile.png'),
      selectedIcon: require('../../assets/icons/tabbar-profile-selected.png'),
    },
  },
);

export const ProfileScreen: NavigationFunctionComponent = ({componentId}) => {
  const authStore = useAuthStore();
  const intl = useIntl();
  useNavigationOptions(componentId);
  return (
    <>
      <ScrollView style={{flex: 1, paddingHorizontal: 16, paddingVertical: 16}}>
        <SafeAreaView>
          <UserCard
            name={authStore.userInfo?.name}
            ssn={formatNationalId(String(authStore.userInfo?.nationalId))}
            actions={[
              {
                text: intl.formatMessage({id: 'profile.seeInfo'}),
                onPress: () => navigateTo(`/personalinfo`),
              },
            ]}
          />

          <Heading>{intl.formatMessage({id: 'profile.infoHeading'})}</Heading>
          <Row>
            <IconButton
              title={intl.formatMessage({id: 'profile.family'})}
              onPress={() => navigateTo(`/family`)}
              image={
                <Image
                  source={familyIcon as any}
                  style={{width: 28, height: 20, resizeMode: 'contain'}}
                />
              }
              style={{marginRight: 8}}
            />
            <IconButton
              title={intl.formatMessage({id: 'profile.vehicles'})}
              onPress={() => navigateTo(`/vehicles`)}
              image={
                <Image
                  source={vehicleIcon as any}
                  style={{width: 24, height: 20, resizeMode: 'contain'}}
                />
              }
              style={{marginRight: 8}}
            />
            <IconButton
              title={intl.formatMessage({id: 'profile.assets'})}
              onPress={() => navigateTo(`/assets`)}
              image={
                <Image
                  source={assetsIcon as any}
                  style={{width: 30, height: 28, resizeMode: 'contain'}}
                />
              }
            />
          </Row>
        </SafeAreaView>
      </ScrollView>
      <BottomTabsIndicator index={4} total={5} />
    </>
  );
};

ProfileScreen.options = getNavigationOptions;

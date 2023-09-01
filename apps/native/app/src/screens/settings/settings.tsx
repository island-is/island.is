import {NavigationBarSheet} from '@ui';
import React from 'react';
import {View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {useIntl} from 'react-intl';
import {testIDs} from '../../utils/test-ids';

import {SettingsContent} from './settings-content';

const {getNavigationOptions, useNavigationOptions} =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }));

export const SettingsScreen: NavigationFunctionComponent = ({componentId}) => {
  useNavigationOptions(componentId);
  const intl = useIntl();
  return (
    <View style={{flex: 1}} testID={testIDs.SCREEN_SETTINGS}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({id: 'setting.screenTitle'})}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{marginHorizontal: 16}}
      />
      <SettingsContent />
    </View>
  );
};

SettingsScreen.options = getNavigationOptions;

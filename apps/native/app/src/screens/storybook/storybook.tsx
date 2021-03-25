import React from 'react'
import { Platform } from 'react-native'
import { getStorybookUI, configure } from '@storybook/react-native';

configure(() =>{
  require('../../../../island-ui/src/lib/Button/Button.stories');
  require('../../../../island-ui/src/lib/Badge/Badge.stories');
  require('../../../../island-ui/src/lib/Card/Card.stories');
  require('../../../../island-ui/src/lib/Alert/Alert.stories');
}, module);

export const StorybookUI = getStorybookUI({
    host: Platform.OS === 'android' ? '10.0.2.2' : '0.0.0.0',
    asyncStorage: require('@react-native-community/async-storage').default
});

export const Storybook = () => {
  return <StorybookUI />;
}

Storybook.options = {
  topBar: {
    title: {
      text: 'Storybook'
    }
  }
};

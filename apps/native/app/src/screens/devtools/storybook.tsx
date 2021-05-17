import React from 'react'
import { Platform } from 'react-native'
import { getStorybookUI, configure } from '@storybook/react-native';

configure(() =>{
  require('../../../../island-ui/src/lib/Button/Button.stories');
  require('../../../../island-ui/src/lib/Badge/Badge.stories');
  require('../../../../island-ui/src/lib/Card/Card.stories');
  require('../../../../island-ui/src/lib/Alert/Alert.stories');
  require('../../../../island-ui/src/lib/Input/Input.stories');
  require('../../../../island-ui/src/lib/Heading/Heading.stories');
  require('../../../../island-ui/src/lib/List/List.stories');
}, module);

export const StorybookUI = getStorybookUI({
    host: Platform.OS === 'android' ? '10.0.2.2' : '0.0.0.0',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    asyncStorage: require('@react-native-community/async-storage').default
});

export const StorybookScreen = () => {
  return <StorybookUI />;
}

StorybookScreen.options = {
  topBar: {
    title: {
      text: 'Storybook'
    }
  }
};

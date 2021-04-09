import { ActionSheetIOS, DevSettings } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { authStore } from '../../stores/auth-store';
import { ComponentRegistry } from '../navigation-registry';
import { getAppRoot } from './get-app-root';

const devMenuOptions = {
  storybook: false,
}

async function toggleStorybook() {
  if (devMenuOptions.storybook) {
    Navigation.setRoot({ root: await getAppRoot() });
  } else {
    Navigation.setRoot({ root: {
      component: {
        name: ComponentRegistry.StorybookScreen
      }
    }})
  }
  devMenuOptions.storybook = !devMenuOptions.storybook;
}

async function enforceLogout() {
  await authStore.getState().logout();
  Navigation.setRoot({ root: await getAppRoot() });
}

export function setupDevMenu() {
  if (!__DEV__) {
    return null;
  }

  DevSettings.addMenuItem('Ísland Dev Menu', () => {
    const options = [
      devMenuOptions.storybook ? 'Disable Storybook' : 'Enable Storybook',
      'Logout'
    ];

    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        ...options,
        'Cancel'
      ],
      cancelButtonIndex: options.length,
    }, (buttonIndex: number) => {
      if (buttonIndex === 0) {
        toggleStorybook();
      }
      if (buttonIndex === 1) {
        enforceLogout();
      }
    });
  });
}

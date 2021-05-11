import { ActionSheetIOS, DevSettings } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { authStore } from '../../stores/auth-store';
import { preferencesStore } from '../../stores/preferences-store';
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
        name: ComponentRegistry.DevtoolsStorybookScreen
      }
    }})
  }
  devMenuOptions.storybook = !devMenuOptions.storybook;
}

async function resetPreferences() {
  await preferencesStore.getState().reset();
}

async function enforceLogout() {
  await authStore.getState().logout();
  Navigation.setRoot({ root: await getAppRoot() });
}

function toggleLanguage() {
  const { locale, setLocale } =preferencesStore.getState();
  setLocale(locale === 'en-US' ? 'is-IS' : 'en-US');
}

export function setupDevMenu() {
  if (!__DEV__) {
    return null;
  }

  DevSettings.addMenuItem('Ísland Dev Menu', () => {
    const options = {
      STORYBOOK: devMenuOptions.storybook ? 'Disable Storybook' : 'Enable Storybook',
      TOGGLE_LANGUAGE: 'Toggle language',
      RESET_PREFERENCES: 'Reset preferences',
      LOGOUT: 'Logout'
    };
    const objectKeys = Object.keys(options);
    const objectValues = Object.values(options);

    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        ...objectValues,
        'Cancel'
      ],
      cancelButtonIndex: objectKeys.length,
    }, (buttonIndex: number) => {
      const optionKey = objectKeys[buttonIndex];
      switch (optionKey) {
        case 'TOGGLE_LANGUAGE':
          return toggleLanguage();
        case 'STORYBOOK':
          return toggleStorybook();
        case 'RESET_PREFERENCES':
          return resetPreferences();
        case 'LOGOUT':
          return enforceLogout();
      }
    });
  });
}

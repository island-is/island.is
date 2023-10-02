// import { Base64 } from 'js-base64'
import {
  Navigation,
  Options,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import {addRoute, addScheme} from '../../lib/deep-linking';
import {DocumentDetailScreen} from '../../screens/document-detail/document-detail';
import {authStore} from '../../stores/auth-store';
import {preferencesStore} from '../../stores/preferences-store';
import {uiStore} from '../../stores/ui-store';
import {
  ComponentRegistry,
  StackRegistry,
  MainBottomTabs,
} from '../component-registry';
import {bundleId} from '../../config';

const selectTab = (currentTabIndex: number) => {
  // Selected Tab navigation event wont fire for this. Need to manually set in ui store.
  const {selectedTab} = uiStore.getState();
  uiStore.setState({unselectedTab: selectedTab, selectedTab: currentTabIndex});
  // switch tab
  Navigation.mergeOptions(MainBottomTabs, {
    bottomTabs: {
      currentTabIndex,
    },
  });
};

export function setupRoutes() {
  // Setup app scheme (is.island.app://)
  addScheme(`${bundleId}://`);

  // Routes
  addRoute('/', () => {
    Navigation.dismissAllModals();
    selectTab(2);
  });

  addRoute('/inbox', () => {
    Navigation.dismissAllModals();
    selectTab(0);
  });

  addRoute('/wallet', () => {
    Navigation.dismissAllModals();
    selectTab(1);
  });

  addRoute('/profile', () => {
    Navigation.dismissAllModals();
    selectTab(4);
  });

  addRoute('/applications', () => {
    Navigation.dismissAllModals();
    selectTab(3);
  });

  addRoute('/vehicles', async (passProps: any) => {
    await Navigation.dismissAllModals();
    await Navigation.popToRoot(StackRegistry.MoreStack);
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.VehiclesScreen,
        passProps,
      },
    });
  });

  addRoute('/assets', async (passProps: any) => {
    await Navigation.dismissAllModals();
    await Navigation.popToRoot(StackRegistry.MoreStack);
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.AssetsOverviewScreen,
        passProps,
      },
    });
  });

  addRoute('/family', async (passProps: any) => {
    await Navigation.dismissAllModals();
    await Navigation.popToRoot(StackRegistry.MoreStack);
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.FamilyScreen,
        passProps,
      },
    });
  });

  addRoute('/personalinfo', async (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.PersonalInfoScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/settings', async (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.SettingsScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/editemail', async (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.EditEmailScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/editphone', async (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.EditPhoneScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/editbankinfo', async (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.EditBankInfoScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/editconfirm/:type', async (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.EditConfirmScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/vehicle/:id', (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.VehicleDetailScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/asset/:id', (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.AssetsDetailScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/finance', async (passProps: any) => {
    await Navigation.dismissAllModals();
    await Navigation.popToRoot(StackRegistry.MoreStack);
    selectTab(4);
    await Navigation.push(ComponentRegistry.MoreScreen, {
      component: {
        name: ComponentRegistry.FinanceScreen,
        passProps,
      },
    });
  });

  addRoute(
    '/finance/status/:orgId/:chargeTypeId/:index',
    async (passProps: any) => {
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: ComponentRegistry.FinanceStatusDetailScreen,
                passProps,
              },
            },
          ],
        },
      });
    },
  );

  addRoute('/family/:type/:nationalId', (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.FamilyDetailScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/notification/:id', (passProps: any) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.NotificationDetailScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute(
    '/wallet/:passId',
    async ({passId, fromId, toId, item, ...rest}: any) => {
      selectTab(1);
      await Navigation.popToRoot(StackRegistry.WalletStack);
      Navigation.push(StackRegistry.WalletStack, {
        component: {
          name: ComponentRegistry.WalletPassScreen,
          passProps: {
            id: passId,
            item,
            ...rest,
          },
          options: {
            animations: {
              push: {
                sharedElementTransitions: [
                  {
                    fromId,
                    toId,
                    interpolation: {type: 'spring'},
                  },
                ],
              },
            },
          },
        },
      });
    },
  );

  addRoute(
    '/walletpassport/:passId',
    async ({passId, fromId, toId, ...rest}: any) => {
      selectTab(1);
      await Navigation.popToRoot(StackRegistry.WalletStack);
      Navigation.push(StackRegistry.WalletStack, {
        component: {
          name: ComponentRegistry.WalletPassportScreen,
          passProps: {
            id: passId,
            ...rest,
          },
          options: {
            animations: {
              push: {
                sharedElementTransitions: [
                  {
                    fromId,
                    toId,
                    interpolation: {type: 'spring'},
                  },
                ],
              },
            },
          },
        },
      });
    },
  );

  addRoute('/license-scanner', async () => {
    Navigation.showModal({
      stack: {
        id: StackRegistry.LicenseScannerStack,
        options: {
          modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
        },
        children: [
          {
            component: {
              name: ComponentRegistry.LicenseScannerScreen,
            },
          },
        ],
      },
    });
  });

  addRoute('/inbox/:docId', async ({docId, title}: any) => {
    selectTab(0);

    // ensure INBOX_SCREEN doesn't already have same screen with same componentId etc.
    await Navigation.dismissAllModals();
    await Navigation.popToRoot(StackRegistry.InboxStack);
    await Navigation.push(StackRegistry.InboxStack, {
      component: {
        name: ComponentRegistry.DocumentDetailScreen,
        passProps: {
          docId,
        },
        options: DocumentDetailScreen.options as Options,
      },
    });
  });

  addRoute('/user', () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.PersonalInfoScreen,
            },
          },
        ],
      },
    });
  });

  addRoute('/notifications', () => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.NotificationsScreen,
            },
          },
        ],
      },
    });
  });

  addRoute('/webview', passProps => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: ComponentRegistry.WebViewScreen,
              passProps,
            },
          },
        ],
      },
    });
  });

  addRoute('/e2e/cookie/:cookie', ({cookie}: any) => {
    // const decodedCookie = Base64.decode(cookie)
    // authStore.setState({ cookies: decodedCookie })
  });

  addRoute('/e2e/disable-applock', () => {
    preferencesStore.setState({dev__useLockScreen: false});
  });
}

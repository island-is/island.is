import { Home } from './screens/home/home';
import { LayoutRoot, Navigation } from "react-native-navigation";
import { Inbox } from './screens/inbox/inbox';
import { Wallet } from './screens/wallet/wallet';
import { User } from './screens/user/user';
import { Login } from './screens/login/login';
import { NavigationProvider } from 'react-native-navigation-hooks'
import { theme } from '@island.is/island-ui/theme';
import React from 'react';

function registerScreen(name: string, Component: React.FunctionComponent) {
  Navigation.registerComponent(
    name,
    () => (props) => {
      return (
        <NavigationProvider value={{ componentId: props.componentId }}>
          <Component {...props} />
        </NavigationProvider>
      )
    },
    () => Component
  )
}

registerScreen('is.island.Login', Login);
registerScreen('is.island.HomeScreen', Home);
registerScreen('is.island.InboxScreen', Inbox);
registerScreen('is.island.WalletScreen', Wallet);
registerScreen('is.island.UserScreen', User);

// login screen
const loginRoot = {
  root: {
    component: {
      name: 'is.island.Login',
    }
  }
};

// show user screen
Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
  if (buttonId === 'userButton') {
    Navigation.showModal({
      component: {
        name: 'is.island.UserScreen' }
      });
  }
});

// bottom tabs
export const mainRoot: LayoutRoot = {
  root: {
    bottomTabs: {
     id: 'BOTTOM_TABS_LAYOUT',
     options: {
       bottomTabs: {
         currentTabIndex: 1,
       }
     },
     children: [
       {
         stack: {
           id: 'INBOX_TAB',
           children: [
             {
               component: {
                 id: 'INBOX_SCREEN',
                 name: 'is.island.InboxScreen'
               }
             }
           ],
           options: {
             bottomTab: {
               icon: {
                 system: 'tray'
               }
             },
           }
         }
       },
       {
         stack: {
           id: 'HOME_TAB',
           children: [
             {
               component: {
                 id: 'HOME_SCREEN',
                 name: 'is.island.HomeScreen'
               }
             }
           ],
           options: {
             bottomTab: {
               icon: require('../assets/logo-island.png'),
               iconHeight: 25,
               iconWidth: 25
             },
           }
         }
       },
       {
         stack: {
           id: 'WALLET_TAB',
           children: [
             {
               component: {
                 id: 'WALLET_SCREEN',
                 name: 'is.island.WalletScreen'
               }
             }
           ],
           options: {
             bottomTab: {
               icon: {
                system: 'wallet.pass'
               }
             },
           }
         }
       },
     ]
   }
  }
}

// register root
Navigation.events().registerAppLaunchedListener(async() => {
  Navigation.setRoot(await isLoggedIn() ? mainRoot : loginRoot);
  // Navigation.setRoot(mainRoot);
});

// auth business logic goes here
async function isLoggedIn() {
  await new Promise(r => setTimeout(r, 2000));
  return false
}

// native navigation options
Navigation.setDefaultOptions({
  topBar: {
    animate: true,
    title: {
      color: '#13134b'
    },
    backButton: {
      color: '#13134b'
    },
    background: {
      color: '#f2f7ff'
    },
    borderHeight: 0,
    borderColor: 'transparent',
    rightButtons: [
      {
        id: 'userButton',
        text: 'User',
        icon: {
          system: 'person.crop.circle'
        }
      },
    ],
  },
  bottomTab: {
    fontSize: 28,
    selectedFontSize: 18,
    selectedTextColor: theme.color.blue600,
    selectedIconColor: theme.color.blue600,
  },
});



import { Home } from './screens/home/home';
import { Navigation } from "react-native-navigation";
import { Inbox } from './screens/inbox/inbox';
import { Wallet } from './screens/wallet/wallet';

Navigation.registerComponent('is.island.HomeScreen', () => Home);
Navigation.registerComponent('is.island.InboxScreen', () => Inbox);
Navigation.registerComponent('is.island.WalletScreen', () => Wallet);

const mainRoot = {
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
             }
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
               icon: {
                 system: 'house',
               }
             }
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
             }
           }
         }
       },
     ]
   }
  }
}


Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot(mainRoot);
});

Navigation.setDefaultOptions({
  topBar: {
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

  },
  bottomTab: {
    fontSize: 28,
    selectedFontSize: 18,
    selectedTextColor: '#0061ff',
    selectedIconColor: '#0061ff',
    badgeColor: 'red',
  },
});


import QuickActions from 'react-native-quick-actions'
import { navigateTo } from '../lib/deep-linking';
import { config } from './config'

const shortcutItems = [
{
  type: 'Wallet',
  title: 'Wallet',
  subtitle: "See all your licenses",
  icon: 'Bookmark',
  userInfo: {
    url: `${config.bundleId}://wallet`,
  },
},
{
  type: 'Inbox',
  title: 'Inbox',
  subtitle: "Get access to documents",
  icon: 'Mail',
  userInfo: {
    url: `${config.bundleId}://inbox`,
  },
},
{
  type: 'User',
  title: 'User Profile',
  subtitle: "See your user profile",
  icon: 'Contact',
  userInfo: {
    url: `${config.bundleId}://user`,
  },
}];

export function setupQuickActions() {
  QuickActions.setShortcutItems(shortcutItems)
  QuickActions.popInitialAction()
  .then(handleQuickAction)
  .catch(() => {
    // noop
  });
}

export function handleQuickAction({ type }: any) {
  const shortcut = shortcutItems.find(s => s.type === type);
  if (shortcut) {
    navigateTo(shortcut.userInfo.url.replace(`${config.bundleId}:/`, ''));
  }
}

import {
  setNotificationHandler,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  DEFAULT_ACTION_IDENTIFIER
} from 'expo-notifications'
import { navigateTo, navigateToNotification } from '../deep-linking';
import { openBrowser } from '../rn-island';

export function setupNotifications() {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  addNotificationReceivedListener(notification => {
    // maybe add to the store that the notification has been received
    console.log('received notification', notification);
  });

  addNotificationResponseReceivedListener(response => {
    const { notification, actionIdentifier } = response;
    const { id, actions = [], link } = (notification.request.content.data || {}) as any;
    const action = actions.find((action: any) => action.id === actionIdentifier);
    navigateToNotification({ id, link: action ? action.link : link });
  });
}

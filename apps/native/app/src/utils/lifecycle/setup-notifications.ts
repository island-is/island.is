import {
  setNotificationHandler,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener
} from 'expo-notifications'

export function setupNotifications() {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  addNotificationReceivedListener(notification => {
    console.log('addNotificationReceivedListener', notification);
  });

  addNotificationResponseReceivedListener(response => {
    console.log('addNotificationResponseReceivedListener', response);
  });
}

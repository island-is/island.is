import { Platform } from 'react-native'
import {
  setNotificationHandler,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  AndroidImportance,
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

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!')
    return
  }

  if (Platform.OS === 'android') {
    setNotificationChannelAsync('default', {
      name: 'default',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }
}

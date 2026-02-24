import AsyncStorage from '@react-native-async-storage/async-storage'
import { getToken } from '@react-native-firebase/messaging'
import { Navigation } from 'react-native-navigation'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getApolloClientAsync } from '../graphql/client'
import {
  AddUserProfileDeviceTokenDocument,
  AddUserProfileDeviceTokenMutation,
  AddUserProfileDeviceTokenMutationVariables,
  DeleteUserProfileDeviceTokenDocument,
  DeleteUserProfileDeviceTokenMutation,
  DeleteUserProfileDeviceTokenMutationVariables,
  GetUserNotificationsUnseenCountDocument,
  GetUserNotificationsUnseenCountQuery,
  GetUserNotificationsUnseenCountQueryVariables,
} from '../graphql/types/schema'
import { ComponentRegistry } from '../utils/component-registry'
import { getRightButtons } from '../utils/get-main-root'
import { setBadgeCountAsync } from 'expo-notifications'
import { preferencesStore } from './preferences-store'
import { app } from '../lib/firebase'
import { create, useStore } from 'zustand'
import * as Device from 'expo-device';

interface NotificationsState {
  unseenCount: number
  pushToken?: string
}

interface NotificationsActions {
  syncToken(): Promise<void>
  checkUnseen(): Promise<void>
  updateNavigationUnseenCount(unseenCount: number): void
  deletePushToken(pushToken: string): Promise<void>
  reset(): void
}

type NotificationsStore = NotificationsState & NotificationsActions

const initialState: NotificationsState = {
  unseenCount: 0,
  pushToken: undefined,
}

export const notificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      async syncToken() {
        if (!Device.isDevice) {
          console.warn('Push notifications are not supported on simulators/emulators')
          return
        }
        const client = await getApolloClientAsync()
        const token = await getToken(app.messaging())
        const { pushToken: oldToken, deletePushToken } = get()

        if (oldToken !== token) {
          if (oldToken) {
            await deletePushToken(oldToken)
          }

          try {
            // Register the new push token
            await client.mutate<
              AddUserProfileDeviceTokenMutation,
              AddUserProfileDeviceTokenMutationVariables
            >({
              mutation: AddUserProfileDeviceTokenDocument,
              variables: {
                input: {
                  deviceToken: token,
                },
              },
            })

            // Update push token in store
            set({ pushToken: token })
          } catch (err) {
            console.error('Failed to register push token', err)
          }
        }
      },
      async deletePushToken(deviceToken: string) {
        const client = await getApolloClientAsync()

        // Attempt to remove old push token
        try {
          await client.mutate<
            DeleteUserProfileDeviceTokenMutation,
            DeleteUserProfileDeviceTokenMutationVariables
          >({
            mutation: DeleteUserProfileDeviceTokenDocument,
            variables: {
              input: {
                deviceToken,
              },
            },
          })

          set({
            pushToken: undefined,
          })
        } catch (err) {
          // noop
          console.error('Error removing old push token', err)
        }
      },
      updateNavigationUnseenCount(unseenCount: number) {
        set({ unseenCount })
        setBadgeCountAsync(unseenCount)

        Navigation.mergeOptions(ComponentRegistry.HomeScreen, {
          topBar: {
            rightButtons: getRightButtons({
              unseenCount,
              icons: ['notifications', 'options'],
            }),
          },
        })
      },
      async checkUnseen() {
        const client = await getApolloClientAsync()
        const locale = preferencesStore.getState().locale

        try {
          const res = await client.query<
            GetUserNotificationsUnseenCountQuery,
            GetUserNotificationsUnseenCountQueryVariables
          >({
            query: GetUserNotificationsUnseenCountDocument,
            fetchPolicy: 'network-only',
            variables: {
              input: {
                limit: 1,
              },
              locale: locale === 'is-IS' ? 'is' : 'en',
            },
          })

          const unseenCount = res?.data?.userNotifications?.unseenCount ?? 0
          get().updateNavigationUnseenCount(unseenCount)
        } catch (err) {
          // noop
        }
      },
      reset() {
        set(initialState)
      },
    }),
    {
      name: 'notifications_07',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ pushToken: state.pushToken, unseenCount: state.unseenCount }), // only persist pushToken
    },
  ),
)

export const useNotificationsStore = <U = NotificationsStore>(selector?: (state: NotificationsStore) => U) => useStore(notificationsStore, selector!)

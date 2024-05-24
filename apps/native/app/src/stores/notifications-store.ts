import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging'
import { Navigation } from 'react-native-navigation'
import createUse from 'zustand'
import { persist } from 'zustand/middleware'
import create, { State } from 'zustand/vanilla'
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

export interface Notification {
  id: string
  category?: string
  title: string
  subtitle?: string
  body?: string
  copy?: string
  data: Record<string, any>
  date: number
  read: boolean
}

interface NotificationsState extends State {
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

const rightButtonScreens = [
  ComponentRegistry.HomeScreen,
  ComponentRegistry.InboxScreen,
  ComponentRegistry.WalletScreen,
  ComponentRegistry.ApplicationsScreen,
  ComponentRegistry.MoreScreen,
]

const initialState: NotificationsState = {
  unseenCount: 0,
  pushToken: undefined,
}

export const notificationsStore = create<NotificationsStore>(
  persist(
    (set, get) => ({
      ...initialState,

      async syncToken() {
        const client = await getApolloClientAsync()
        const token = await messaging().getToken()
        const { pushToken: oldToken, deletePushToken } = get()

        if (oldToken !== token) {
          if (oldToken) {
            await deletePushToken(oldToken)
          }

          try {
            // Register the new push token
            const res = await client.mutate<
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

            console.log('Registered push token', res)
            // Update push token in store
            set({ pushToken: token })
          } catch (err) {
            console.log('Failed to register push token', err)
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

        rightButtonScreens.forEach((componentId) => {
          Navigation.mergeOptions(componentId, {
            topBar: {
              rightButtons: getRightButtons({ unseenCount }),
            },
          })
        })
      },
      async checkUnseen() {
        const client = await getApolloClientAsync()

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
      getStorage: () => AsyncStorage,
    },
  ),
)

export const useNotificationsStore = createUse(notificationsStore)

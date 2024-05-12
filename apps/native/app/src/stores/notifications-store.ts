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
  GetUserNotificationsOverviewDocument,
  GetUserNotificationsOverviewQuery,
  GetUserNotificationsOverviewQueryVariables,
} from '../graphql/types/schema'
import { ComponentRegistry } from '../utils/component-registry'
import { getRightButtons } from '../utils/get-main-root'
import { createMKKVStorage, createZustandMKKVStorage } from './mmkv'

const notificationsStorage = createZustandMKKVStorage(createMKKVStorage())

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

interface NotificationsStore extends State {
  unseenCount: number
  pushToken?: string
  actions: {
    syncToken(): Promise<void>
    checkUnseen(): Promise<void>
  }
}

const rightButtonScreens = [
  ComponentRegistry.HomeScreen,
  ComponentRegistry.InboxScreen,
  ComponentRegistry.WalletScreen,
  ComponentRegistry.ApplicationsScreen,
]

export const notificationsStore = create<NotificationsStore>(
  persist(
    (set, get) => ({
      unseenCount: 0,
      pushToken: undefined,
      actions: {
        syncToken: async () => {
          const client = await getApolloClientAsync()

          const token = await messaging().getToken()
          const { pushToken } = get()

          if (pushToken !== token) {
            if (pushToken) {
              // Attempt to remove old push token
              try {
                await client.mutate<
                  DeleteUserProfileDeviceTokenMutation,
                  DeleteUserProfileDeviceTokenMutationVariables
                >({
                  mutation: DeleteUserProfileDeviceTokenDocument,
                  variables: {
                    input: {
                      deviceToken: pushToken,
                    },
                  },
                })
              } catch (err) {
                // noop
                console.error('Error removing old push token', err)
              }
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
        checkUnseen: async () => {
          const client = await getApolloClientAsync()

          try {
            const res = await client.query<
              GetUserNotificationsOverviewQuery,
              GetUserNotificationsOverviewQueryVariables
            >({
              query: GetUserNotificationsOverviewDocument,
              fetchPolicy: 'network-only',
              variables: {
                input: {
                  limit: 1,
                },
              },
            })
            const unseenCount =
              res?.data?.userNotificationsOverview?.unseenCount ?? 0
            console.log('Unseen count', unseenCount)
            set({ unseenCount })

            rightButtonScreens.forEach((componentId) => {
              Navigation.mergeOptions(componentId, {
                topBar: {
                  rightButtons: getRightButtons({ unseenCount }),
                },
              })
            })
          } catch (err) {
            // noop
            // TODO handle error with toast when implemented
          }
        },
      },
    }),
    {
      name: 'notifications_07',
      getStorage: () => notificationsStorage,
    },
  ),
)

export const useNotificationsStore = createUse(notificationsStore)
export const useNotificationsActions = () =>
  useNotificationsStore(({ actions }) => actions)

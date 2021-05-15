import AsyncStorage from '@react-native-community/async-storage'
import createUse from 'zustand'
import { persist } from 'zustand/middleware'
import create, { State } from 'zustand/vanilla'

interface NotificationsStore extends State {
  readItems: Set<string>
  setRead(notificationId: string): void
  setUnread(notificationId: string): void
}

export const notificationsStore = create<NotificationsStore>(
  persist(
    (set, get) => ({
      readItems: new Set(),
      setRead(notificationId: string) {
        const readItems = get().readItems
        readItems.add(notificationId)
        set({ readItems })
      },
      setUnread(notificationId: string) {
        const readItems = get().readItems
        readItems.delete(notificationId)
        set({ readItems })
      },
    }),
    {
      name: 'notifications02',
      getStorage: () => AsyncStorage,
      serialize({ state, version }) {
        const res: any = { ...state }
        res.readItems = [...res.readItems]
        return JSON.stringify({ state: res, version })
      },
      deserialize(str: string) {
        const { state, version } = JSON.parse(str)
        state.readItems = new Set(state.readItems)
        return { state, version }
      },
    },
  ),
)

export const useNotificationsStore = createUse(notificationsStore)

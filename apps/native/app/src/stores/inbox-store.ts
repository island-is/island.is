import AsyncStorage from '@react-native-community/async-storage'
import createUse from 'zustand'
import { persist } from 'zustand/middleware'
import create from 'zustand/vanilla'

interface InboxStore {
  readItems: string[]
  initialized: boolean
  actions: {
    setRead(documentId: string): void;
    setUnread(documentId: string): void;
  }
}

export const inboxStore = create<InboxStore>(
  persist(
    (set, get) => ({
      initialized: false,
      readItems: [],
      actions: {
        setRead(documentId: string) {
          // @todo mark corresponding notification which points to this document "as read".
          set({ readItems: [...get().readItems, documentId] });
        },
        setUnread(documentId: string) {
          set({ readItems: [...get().readItems.filter(n => n !== documentId)] });
        }
      }
    }),
    {
      name: 'inbox_02',
      getStorage: () => AsyncStorage,
      deserialize(str: string) {
        const { state, version } = JSON.parse(str)
        delete state.actions
        return { state, version }
      },
    },
  ),
)

export const useInboxStore = createUse(inboxStore)

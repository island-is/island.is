import AsyncStorage from '@react-native-community/async-storage';
import createUse from 'zustand';
import {persist} from 'zustand/middleware';
import create from 'zustand/vanilla';

interface CacheItem {
  initialized: boolean;
  read: string[];
}

interface InboxStore {
  cache: Map<string, CacheItem>;
  nationalId: string | null;
  readItems: string[];
  initialized: boolean;
  actions: {
    getCacheItem(nationalId?: string | null): CacheItem | void;
    setNationalId(nationalId: string | null): void;
    setInitialized(initialized: boolean): void;
    setRead(documentId: string | string[]): void;
    setUnread(documentId: string | string[]): void;
  };
}

export const inboxStore = create<InboxStore>(
  persist(
    (set, get) => ({
      cache: new Map(),
      nationalId: null,
      readItems: [],
      initialized: false,
      actions: {
        getCacheItem(nationalId = get().nationalId) {
          const {cache} = get();
          if (nationalId) {
            if (!cache.has(nationalId)) {
              cache.set(nationalId, {initialized: false, read: []});
            }
            return cache.get(nationalId)!;
          }
        },
        setNationalId(nationalId: string | null) {
          const item = get().actions.getCacheItem(nationalId);
          set({
            nationalId,
            initialized: item?.initialized ?? false,
            readItems: item?.read ?? [],
          });
        },
        setInitialized(initialized: boolean) {
          const item = get().actions.getCacheItem();
          if (item) {
            item.initialized = initialized;
            set({initialized, cache: new Map(get().cache)});
          }
        },
        setRead(documentId: string | string[]) {
          const item = get().actions.getCacheItem();
          if (item) {
            item.read = [...item.read].concat(documentId);
            // @todo mark corresponding notification which points to this document "as read".
            set({readItems: item.read, cache: new Map(get().cache)});
          }
        },
        setUnread(documentId: string | string[]) {
          const item = get().actions.getCacheItem();
          if (item) {
            const ids = ([] as string[]).concat(documentId);
            item.read = item.read.filter(n => !ids.includes(n));
            set({readItems: item.read, cache: new Map(get().cache)});
          }
        },
      },
    }),
    {
      name: 'inbox_03',
      getStorage: () => AsyncStorage,
      serialize({state, version}) {
        const res: any = {...state};
        res.cache = [...res.cache];
        return JSON.stringify({state: res, version});
      },
      deserialize(str: string) {
        const {state, version} = JSON.parse(str);
        // cast to Map
        state.cache = new Map(state.cache);
        // actions
        delete state.actions;
        return {state, version};
      },
    },
  ),
);

export const useInboxStore = createUse(inboxStore);

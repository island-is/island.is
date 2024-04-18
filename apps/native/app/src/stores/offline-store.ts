import createUse from 'zustand'
import create from 'zustand/vanilla'
import { isDefined } from '../utils/is-defined'

interface State {
  currentComponentId: string | null
  pastIsConnected: boolean
  isConnected: boolean | null
  showBanner: boolean
  bannerHasBeenShown: boolean
}

interface Actions {
  toggleBanner(show: boolean): void
  setIsConnected(isConnected: boolean): void
  setNetInfoNoConnection(): void
  setCurrentComponentId(currentComponentId: string): void
  setBannerHasBeenShown(bannerHasBeenShown: boolean): void
  resetConnectionState(): void
}

export type OfflineStore = State & Actions

export const offlineStore = create<OfflineStore>((set) => ({
  pastIsConnected: true,
  isConnected: true,
  showBanner: false,
  currentComponentId: null,
  bannerHasBeenShown: false,

  setIsConnected: (isConnected) =>
    set((state) => ({ isConnected, pastIsConnected: !!state.isConnected })),

  setNetInfoNoConnection: () =>
    set(({ isConnected }) => ({
      pastIsConnected: isDefined(isConnected) ? !isConnected : true,
      isConnected: false,
      showBanner: true,
    })),

  toggleBanner: (show) => set((state) => ({ showBanner: show })),

  setCurrentComponentId: (currentComponentId) =>
    set((state) => ({ currentComponentId })),

  setBannerHasBeenShown: (bannerHasBeenShown) =>
    set((state) => ({ bannerHasBeenShown })),

  resetConnectionState: () =>
    set((state) => ({
      pastIsConnected: true,
      isConnected: true,
      showBanner: false,
      bannerHasBeenShown: false,
    })),
}))

export const useOfflineStore = createUse(offlineStore)

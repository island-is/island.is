import { create } from 'zustand'

interface HealthMessagesFilterState {
  starred: boolean
  archived: boolean
}

const initialFilters: HealthMessagesFilterState = {
  starred: false,
  archived: false,
}

export const healthMessagesFilterStore =
  create<HealthMessagesFilterState>(() => ({
    ...initialFilters,
  }))

export const useHealthMessagesFilterStore = healthMessagesFilterStore

export const resetHealthMessagesFilters = () =>
  healthMessagesFilterStore.setState(initialFilters)

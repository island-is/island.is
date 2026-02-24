import { create } from 'zustand'
import type {
  DocumentsV2Category,
  DocumentsV2Sender,
} from '@/graphql/types/schema'

interface InboxFilterState {
  // Filter values
  opened: boolean
  archived: boolean
  bookmarked: boolean
  senderNationalId: string[]
  categoryIds: string[]
  dateFrom: Date | undefined
  dateTo: Date | undefined
  // Available options (populated by inbox screen query)
  availableSenders: DocumentsV2Sender[]
  availableCategories: DocumentsV2Category[]
}

const initialFilters = {
  opened: false,
  archived: false,
  bookmarked: false,
  senderNationalId: [] as string[],
  categoryIds: [] as string[],
  dateFrom: undefined as Date | undefined,
  dateTo: undefined as Date | undefined,
}

export const inboxFilterStore = create<InboxFilterState>(() => ({
  ...initialFilters,
  availableSenders: [],
  availableCategories: [],
}))

export const useInboxFilterStore = inboxFilterStore

export const resetInboxFilters = () =>
  inboxFilterStore.setState(initialFilters)

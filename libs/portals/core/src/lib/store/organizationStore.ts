import { create } from 'zustand'

import { createSelectors } from './storeSelectors'

type Organization = {
  id: string
  title: string
  slug: string
  logo?: {
    id: string
    url: string
    title: string
  } | null
}

export interface OrganizationStoreState {
  organizations: Organization[]
  organization?: Organization
  setServiceError(organizationSlug?: string): void
  setOrganizationData(organizationData?: Organization[]): void
}

const useOrganizationStoreBase = create<OrganizationStoreState>()((set) => ({
  organizations: [],
  setServiceError: (organizationSlug) =>
    set((state) => ({
      organization: organizationSlug
        ? state.organizations.find(({ slug }) => organizationSlug === slug)
        : undefined,
    })),
  setOrganizationData: (organizationData) =>
    set((state) => ({
      ...state,
      organizations: organizationData,
    })),
}))

export const useOrganizationStore = createSelectors(useOrganizationStoreBase)

import { applicationsModule } from '@island.is/service-portal/applications'
import { documentsModule } from '@island.is/service-portal/documents'

import {
  ServicePortalModule,
  ServicePortalNavigationItem,
} from '@island.is/service-portal/core'

export interface MockUserData {
  actor: {
    name: string
    nationalId: string
  }
  exp: string
  iat: string
  sub: {
    name: string
    nationalId: string
    scope: string[]
    subjectType: string
  }
}

export interface Navigation {
  applications: ServicePortalNavigationItem | null
  documents: ServicePortalNavigationItem | null
}

export type Action =
  | { type: 'fetchingUser' }
  | { type: 'setUser'; payload: MockUserData }
  | { type: 'setNavigation'; payload: Navigation }

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export interface StoreState {
  userInfo: MockUserData | null
  userInfoState: AsyncActionState
  modules: {
    applicationsModule: ServicePortalModule
    documentsModule: ServicePortalModule
  }
  navigation: Navigation
  navigationState: AsyncActionState
}

export const initialState: StoreState = {
  userInfo: null,
  userInfoState: 'passive',
  modules: {
    applicationsModule,
    documentsModule,
  },
  navigation: {
    applications: null,
    documents: null,
  },
  navigationState: 'passive',
}

export const reducer = (state: StoreState, action: Action) => {
  switch (action.type) {
    case 'fetchingUser':
      return {
        ...state,
        userInfoState: 'pending',
      }
    case 'setUser':
      return {
        ...state,
        userInfo: action.payload,
        userInfoState: 'fulfilled',
      }
    case 'setNavigation':
      return {
        ...state,
        navigation: action.payload,
        navigationState: 'fulfilled',
      }
    default:
      return state
  }
}

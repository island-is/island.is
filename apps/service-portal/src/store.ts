import { applicationsModule } from '@island.is/service-portal/applications'
import {
  ServicePortalModule,
  ServicePortalNavigationItem,
} from '@island.is/service-portal/core'

export interface MockUserData {
  userInfo: {
    nationalId: string
    availableSubjects: {
      name: string
      email: string
      nationalId: string
      scopes: string[]
    }
  }
  name: ''
  modules: {
    name: string
  }[]
}

export type ActionType = 'fetchingUser' | 'setUser' | 'setNavigation'

export type Action = {
  type: ActionType
  payload?: null | object | string | number | boolean
}

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export interface StoreState {
  userInfo: MockUserData | null
  userInfoState: AsyncActionState
  modules: {
    applicationsModule: ServicePortalModule
  }
  navigation: {
    applications: ServicePortalNavigationItem | null
  }
}

export const initialState: StoreState = {
  userInfo: null,
  userInfoState: 'passive',
  modules: {
    applicationsModule,
  },
  navigation: {
    applications: null,
  },
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
      }

    default:
      return state
  }
}

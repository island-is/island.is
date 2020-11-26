import {
  ServicePortalModule,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { modules } from './modules'
import { Action, ActionType, AsyncActionState, MenuState } from './actions'
import { User } from 'oidc-client'

export interface StoreState {
  userInfo: User | null
  userInfoState: AsyncActionState | 'logging-out'
  modules: ServicePortalModule[]
  navigationState: AsyncActionState
  notificationMenuState: MenuState
  mobileMenuState: MenuState
  routes: ServicePortalRoute[]
}

export const initialState: StoreState = {
  userInfo: null,
  userInfoState: 'passive',
  modules: modules,
  navigationState: 'passive',
  notificationMenuState: 'closed',
  mobileMenuState: 'closed',
  routes: [],
}

export const reducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
    case ActionType.SetUserPending:
      return {
        ...state,
        userInfoState: 'pending',
      }
    case ActionType.SetUserFulfilled:
      return {
        ...state,
        userInfo: action.payload,
        userInfoState: 'fulfilled',
      }
    case ActionType.SetNotificationMenuState:
      return {
        ...state,
        notificationMenuState: action.payload,
      }

    case ActionType.SetMobileMenuState:
      return {
        ...state,
        mobileMenuState: action.payload,
      }
    case ActionType.SetUserLoggedOut:
      return {
        ...initialState,
      }
    case ActionType.SetRoutesFulfilled:
      return {
        ...state,
        routes: action.payload,
      }
    case ActionType.SetUserLoggingOut:
      return {
        ...state,
        userInfoState: 'logging-out',
      }
    default:
      return state
  }
}

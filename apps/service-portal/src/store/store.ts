import { ServicePortalRoute } from '@island.is/service-portal/core'
import { Action, ActionType, AsyncActionState, MenuState } from './actions'

export interface StoreState {
  navigationState: AsyncActionState
  notificationMenuState: MenuState
  sidebarState: MenuState
  mobileMenuState: MenuState
  userMenuState: MenuState
  routes: ServicePortalRoute[]
}

export const initialState: StoreState = {
  navigationState: 'passive',
  sidebarState: 'open',
  notificationMenuState: 'closed',
  mobileMenuState: 'closed',
  userMenuState: 'closed',
  routes: [],
}

export const reducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
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
    case ActionType.SetUserMenuState:
      return {
        ...state,
        userMenuState: action.payload,
      }
    case ActionType.SetRoutesFulfilled:
      return {
        ...state,
        routes: action.payload,
      }
    case ActionType.SetSidebarMenuState:
      return {
        ...state,
        sidebarState: action.payload,
      }
    default:
      return state
  }
}

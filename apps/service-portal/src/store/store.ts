import {
  ServicePortalModule,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import uniqBy from 'lodash/uniqBy'
import { modules, ModuleKeys } from './modules'
import { Action, ActionType, AsyncActionState, MenuState } from './actions'

export interface StoreState {
  modules: Record<ModuleKeys, ServicePortalModule>
  modulesPending: boolean
  navigationState: AsyncActionState
  notificationMenuState: MenuState
  mobileMenuState: MenuState
  userMenuState: MenuState
  routes: ServicePortalRoute[]
}

export const initialState: StoreState = {
  modules,
  modulesPending: true,
  navigationState: 'passive',
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
    case ActionType.UpdateFulfilledRoutes:
      return {
        ...state,
        routes: uniqBy([...action.payload, ...state.routes], 'path'),
      }
    case ActionType.SetModulesList:
      return {
        ...state,
        modules: action.payload,
        modulesPending: false,
      }
    default:
      return state
  }
}

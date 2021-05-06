import {
  ServicePortalModule,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { modules, ModuleKeys } from './modules'
import { Action, ActionType, AsyncActionState, MenuState } from './actions'
import { User } from 'oidc-client'

export interface StoreState {
  userInfo: User | null
  userInfoState: AsyncActionState | 'logging-out'
  modules: Record<ModuleKeys, ServicePortalModule>
  modulesPending: boolean
  navigationState: AsyncActionState
  notificationMenuState: MenuState
  mobileMenuState: MenuState
  userMenuState: MenuState
  routes: ServicePortalRoute[]
}

const MOCK_SIGN_IN = process.env.API_MOCKS === 'true' || process.env.MOCK_SIGN_IN === 'true'
const userObject = JSON.parse(
  '{"id_token":"a.e.b","session_state":"a.b","access_token":"a.b.c","refresh_token":"a","token_type":"Bearer","scope":"openid profile offline_access","profile":{"s_hash":"sss","sid":"98","sub":"FA","auth_time":1602141813,"idp":"islykill","amr":["external"],"name":"Tester Testerson","natreg":"1231231234","nat":"IS"},"expires_at":1602152675,"state":"/minar-upplysingar"}',
)

export const initialState: StoreState = {
  userInfo: MOCK_SIGN_IN ? userObject : null,
  userInfoState: 'passive',
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
    case ActionType.SetUserMenuState:
      return {
        ...state,
        userMenuState: action.payload,
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
    case ActionType.SetModulesList:
      return {
        ...state,
        modules: action.payload,
        modulesPending: false,
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

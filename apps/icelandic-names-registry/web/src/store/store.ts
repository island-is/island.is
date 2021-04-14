import { Action, ActionType, AsyncActionState, MenuState } from './actions'
import { User } from 'oidc-client'

export interface StoreState {
  userInfo: User | null
  userInfoState: AsyncActionState | 'logging-out'
  navigationState: AsyncActionState
  mobileMenuState: MenuState
  userMenuState: MenuState
}

const MOCK_SIGN_IN = process.env.API_MOCKS === 'true'
const userObject = JSON.parse(
  '{"id_token":"a.e.b","session_state":"a.b","access_token":"a.b.c","refresh_token":"a","token_type":"Bearer","scope":"openid profile offline_access","profile":{"s_hash":"sss","sid":"98","sub":"FA","auth_time":1602141813,"idp":"islykill","amr":["external"],"name":"Tester Testerson","natreg":"1231231234","nat":"IS"},"expires_at":1602152675,"state":"/minar-upplysingar"}',
)

export const initialState: StoreState = {
  userInfo: MOCK_SIGN_IN ? userObject : null,
  userInfoState: 'passive',
  navigationState: 'passive',
  mobileMenuState: 'closed',
  userMenuState: 'closed',
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
    case ActionType.SetUserLoggingOut:
      return {
        ...state,
        userInfoState: 'logging-out',
      }
    default:
      return state
  }
}

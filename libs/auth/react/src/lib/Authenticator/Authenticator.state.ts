import { IDTokenClaims, User as OidcUser } from 'oidc-client'
import { Dispatch } from 'react'

interface IdsAuthClaims {
  nationalId: string
  name: string
  nat: string
  idp: string
  act?: {
    nationalId: string
    name: string
  }
}

export type User = Omit<OidcUser, 'profile'> & {
  profile: IDTokenClaims & IdsAuthClaims
}

export type UserInfoState =
  | 'passive'
  | 'pending'
  | 'fulfilled'
  | 'failed'
  | 'logging-out'

export interface AuthReducerState {
  userInfo: User | null
  userInfoState: UserInfoState
  isAuthenticated: boolean
}

export enum ActionType {
  SIGNIN_START = 'SIGNIN_START',
  SIGNIN_SUCCESS = 'SIGNIN_SUCCESS',
  SIGNIN_FAILURE = 'SIGNIN_FAILURE',
  LOGGING_OUT = 'LOGGING_OUT',
  LOGGED_OUT = 'LOGGED_OUT',
  USER_LOADED = 'USER_LOADED',
}

interface Action {
  type: ActionType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

export const initialState: AuthReducerState = {
  userInfo: null,
  userInfoState: 'passive',
  isAuthenticated: false,
}

export type AuthDispatch = Dispatch<Action>

export const reducer = (
  state: AuthReducerState,
  action: Action,
): AuthReducerState => {
  switch (action.type) {
    case ActionType.SIGNIN_START:
      return {
        ...state,
        userInfoState: 'pending',
      }
    case ActionType.SIGNIN_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        userInfoState: 'fulfilled',
        isAuthenticated: true,
      }
    case ActionType.USER_LOADED:
      return state.isAuthenticated
        ? {
            ...state,
            userInfo: action.payload,
          }
        : state
    case ActionType.SIGNIN_FAILURE:
      return {
        ...state,
        userInfoState: 'failed',
      }
    case ActionType.LOGGING_OUT:
      return {
        ...state,
        userInfoState: 'logging-out',
      }
    case ActionType.LOGGED_OUT:
      return {
        ...initialState,
      }
    default:
      return state
  }
}

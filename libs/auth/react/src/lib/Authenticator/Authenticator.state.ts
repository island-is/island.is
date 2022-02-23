import { Dispatch } from 'react'
import { User } from '@island.is/shared/types'

export type AuthState =
  | 'logged-out'
  | 'loading'
  | 'logged-in'
  | 'failed'
  | 'switching'
  | 'logging-out'

export interface AuthReducerState {
  userInfo: User | null
  authState: AuthState
  isAuthenticated: boolean
}

export enum ActionType {
  SIGNIN_START = 'SIGNIN_START',
  SIGNIN_SUCCESS = 'SIGNIN_SUCCESS',
  SIGNIN_FAILURE = 'SIGNIN_FAILURE',
  LOGGING_OUT = 'LOGGING_OUT',
  LOGGED_OUT = 'LOGGED_OUT',
  USER_LOADED = 'USER_LOADED',
  SWITCH_USER = 'SWITCH_USER',
}

interface Action {
  type: ActionType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

export const initialState: AuthReducerState = {
  userInfo: null,
  authState: 'logged-out',
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
        authState: 'loading',
      }
    case ActionType.SIGNIN_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        authState: 'logged-in',
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
        authState: 'failed',
      }
    case ActionType.LOGGING_OUT:
      return {
        ...state,
        authState: 'logging-out',
      }
    case ActionType.SWITCH_USER:
      return {
        ...state,
        authState: 'switching',
      }
    case ActionType.LOGGED_OUT:
      return {
        ...initialState,
      }
    default:
      return state
  }
}

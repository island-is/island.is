import { BffUser } from '@island.is/shared/types'

export type BffState =
  | 'logged-out'
  | 'loading'
  | 'logged-in'
  | 'failed'
  | 'switching'
  | 'logging-out'
  | 'error'

export enum ActionType {
  SIGNIN_START = 'SIGNIN_START',
  SIGNIN_SUCCESS = 'SIGNIN_SUCCESS',
  SIGNIN_FAILURE = 'SIGNIN_FAILURE',
  LOGGING_OUT = 'LOGGING_OUT',
  LOGGED_OUT = 'LOGGED_OUT',
  SWITCH_USER = 'SWITCH_USER',
  ERROR = 'ERROR',
}

export interface BffReducerStateBase {
  authState: BffState
  isAuthenticated: boolean
  error?: Error
}

export interface NonLoggedInState extends BffReducerStateBase {
  authState: Exclude<BffState, 'logged-in'>
  userInfo: null
}

export interface LoggedInState extends BffReducerStateBase {
  authState: 'logged-in'
  userInfo: BffUser
}

export type BffReducerState = NonLoggedInState | LoggedInState

export const initialState: NonLoggedInState = {
  userInfo: null,
  authState: 'logged-out',
  isAuthenticated: false,
}

export type Action =
  | {
      type:
        | ActionType.SIGNIN_START
        | ActionType.SIGNIN_FAILURE
        | ActionType.LOGGING_OUT
        | ActionType.LOGGED_OUT
        | ActionType.SWITCH_USER
    }
  | {
      type: ActionType.SIGNIN_SUCCESS
      payload: BffUser
    }
  | { type: ActionType.ERROR; payload: Error }

export const withState = <T extends BffReducerStateBase>(
  state: T,
  newState: Partial<T>,
): T => ({
  ...state,
  ...newState,
})

export const reducer = (
  state: BffReducerState,
  action: Action,
): BffReducerState => {
  switch (action.type) {
    case ActionType.SIGNIN_START:
      return {
        ...state,
        authState: 'loading',
        userInfo: null,
        isAuthenticated: false,
      }

    case ActionType.SIGNIN_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        authState: 'logged-in',
        isAuthenticated: true,
      }

    case ActionType.SIGNIN_FAILURE:
      return {
        ...state,
        authState: 'failed',
        userInfo: null,
        isAuthenticated: false,
      }

    case ActionType.LOGGING_OUT:
      return {
        ...state,
        authState: 'logging-out',
        userInfo: null,
      }

    case ActionType.SWITCH_USER:
      return {
        ...state,
        authState: 'switching',
        userInfo: null,
      }

    case ActionType.ERROR:
      return {
        ...state,
        error: action.payload,
        authState: 'error',
        userInfo: null,
      }

    case ActionType.LOGGED_OUT:
      return initialState

    default:
      return state
  }
}

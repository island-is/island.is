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
  USER_LOADED = 'USER_LOADED',
  SWITCH_USER = 'SWITCH_USER',
  ERROR = 'ERROR',
}

export interface BffReducerState {
  userInfo: BffUser | null
  authState: BffState
  isAuthenticated: boolean
  error?: Error
}

export const initialState: BffReducerState = {
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
      type: ActionType.SIGNIN_SUCCESS | ActionType.USER_LOADED
      payload: BffUser
    }
  | { type: ActionType.ERROR; payload: Error }

export const reducer = (
  state: BffReducerState,
  action: Action,
): BffReducerState => {
  const withState = (newState: Partial<BffReducerState>) => ({
    ...state,
    ...newState,
  })

  switch (action.type) {
    case ActionType.SIGNIN_START:
      return withState({
        authState: 'loading',
      })

    case ActionType.SIGNIN_SUCCESS:
      return withState({
        userInfo: action.payload,
        authState: 'logged-in',
        isAuthenticated: true,
      })

    case ActionType.USER_LOADED:
      return state.isAuthenticated
        ? withState({
            userInfo: action.payload,
          })
        : state

    case ActionType.SIGNIN_FAILURE:
      return withState({
        authState: 'failed',
      })

    case ActionType.LOGGING_OUT:
      return withState({
        authState: 'logging-out',
      })

    case ActionType.SWITCH_USER:
      return withState({
        authState: 'switching',
      })

    case ActionType.ERROR:
      return withState({
        error: action.payload,
      })

    case ActionType.LOGGED_OUT:
      return {
        ...initialState,
      }

    default:
      return state
  }
}

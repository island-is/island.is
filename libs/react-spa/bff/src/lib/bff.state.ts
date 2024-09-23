import { BffUser } from '@island.is/shared/types'

// Defining the possible states for authentication
export type BffState =
  | 'logged-out'
  | 'loading'
  | 'logged-in'
  | 'failed'
  | 'switching'
  | 'logging-out'
  | 'error'

// Use enum to define the action types, providing more type-safety
export enum ActionType {
  SIGNIN_START = 'SIGNIN_START',
  SIGNIN_SUCCESS = 'SIGNIN_SUCCESS',
  SIGNIN_FAILURE = 'SIGNIN_FAILURE',
  LOGGING_OUT = 'LOGGING_OUT',
  LOGGED_OUT = 'LOGGED_OUT',
  SWITCH_USER = 'SWITCH_USER',
  ERROR = 'ERROR',
}

// Base interface for reducer state, shared by all states
export interface BffReducerStateBase {
  authState: BffState
  isAuthenticated: boolean
  error?: Error | null
}

// State when the user is not logged in
export interface NonLoggedInState extends BffReducerStateBase {
  authState: Exclude<BffState, 'logged-in'>
  userInfo: null
}

// State when the user is logged in
export interface LoggedInState extends BffReducerStateBase {
  authState: 'logged-in'
  userInfo: BffUser
  isAuthenticated: true
}

// Union type for the overall reducer state
export type BffReducerState = NonLoggedInState | LoggedInState

// Initial state, representing a logged-out user
export const initialState: NonLoggedInState = {
  userInfo: null,
  authState: 'logged-out',
  isAuthenticated: false,
  error: null,
}

// Define possible action types and payloads
export type Action =
  | {
      type:
        | ActionType.SIGNIN_START
        | ActionType.SIGNIN_FAILURE
        | ActionType.LOGGING_OUT
        | ActionType.LOGGED_OUT
        | ActionType.SWITCH_USER
    }
  | { type: ActionType.SIGNIN_SUCCESS; payload: BffUser }
  | { type: ActionType.ERROR; payload: Error }

// Helper function to reset user-related state when switching users or logging out
const resetState = (authState: BffState): NonLoggedInState => ({
  userInfo: null,
  authState,
  isAuthenticated: false,
  error: null,
})

// Reducer function to handle state transitions based on actions
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
      }

    case ActionType.SIGNIN_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        authState: 'logged-in',
        isAuthenticated: true,
        error: null,
      }

    case ActionType.SIGNIN_FAILURE:
      return resetState('failed')

    case ActionType.LOGGING_OUT:
      return resetState('logging-out')

    case ActionType.SWITCH_USER:
      return resetState('switching')

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

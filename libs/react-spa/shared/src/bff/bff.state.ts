import { BffUser } from '@island.is/shared/types'
import { BffError } from './BffError'

// Defining the possible states for authentication
export type BffState =
  | 'logged-out'
  | 'loading'
  | 'logged-in'
  | 'switching'
  | 'logging-out'
  | 'error'

export type NonLoggedInAuthState = Exclude<BffState, 'logged-in'>

export interface BffReducerStateBase {
  authState: BffState
  isAuthenticated: boolean
  error?: BffError | null
}

// State when the user is not logged in
export interface NonLoggedInState extends BffReducerStateBase {
  authState: NonLoggedInAuthState
  userInfo: null
}

// State when the user is logged in
export interface LoggedInState extends BffReducerStateBase {
  authState: 'logged-in'
  userInfo: BffUser
  isAuthenticated: true
}

export type BffReducerState = NonLoggedInState | LoggedInState

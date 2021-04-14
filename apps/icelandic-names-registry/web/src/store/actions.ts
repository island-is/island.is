import { User } from 'oidc-client'

export type MenuState = 'open' | 'closed'
export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export enum ActionType {
  SetUserPending = 'setUserPending',
  SetUserLoggedOut = 'setUserLoggedOut',
  SetUserFulfilled = 'setUserFulfilled',
  SetUserLoggingOut = 'setUserLoggingOut',
  SetMobileMenuState = 'setMobileMenuState',
  SetUserMenuState = 'setUserMenuState',
  SetRoutesFulfilled = 'setRoutesFulfilled',
}

export type Action =
  | { type: ActionType.SetUserPending }
  | { type: ActionType.SetUserLoggedOut }
  | { type: ActionType.SetUserFulfilled; payload: User }
  | {
      type: ActionType.SetMobileMenuState
      payload: MenuState
    }
  | {
      type: ActionType.SetUserMenuState
      payload: MenuState
    }
  | {
      type: ActionType.SetRoutesFulfilled
    }
  | {
      type: ActionType.SetUserLoggingOut
    }

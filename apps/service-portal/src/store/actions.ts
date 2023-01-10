import { ServicePortalRoute } from '@island.is/service-portal/core'

export type MenuState = 'open' | 'closed'
export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export enum ActionType {
  FetchSubjectListPending = 'fetchSubjectListPending',
  FetchSubjectListFulfilled = 'fetchSubjectListFulfilled',
  FetchSubjectListFailed = 'fetchSubjectListFailed',
  SetNotificationMenuState = 'setNotificationMenuState',
  SetMobileMenuState = 'setMobileMenuState',
  SetUserMenuState = 'setUserMenuState',
  SetRoutesFulfilled = 'setRoutesFulfilled',
  SetSidebarMenuState = 'setSidebarMenuState',
}

export type Action =
  | { type: ActionType.FetchSubjectListPending }
  | { type: ActionType.FetchSubjectListFailed }
  | {
      type: ActionType.SetNotificationMenuState
      payload: MenuState
    }
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
      payload: ServicePortalRoute[]
    }
  | {
      type: ActionType.SetSidebarMenuState
      payload: MenuState
    }

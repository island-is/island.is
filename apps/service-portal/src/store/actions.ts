import { User } from 'oidc-client'
import { SubjectListDto } from '../mirage-server/models/subject'
import { ServicePortalRoute } from '@island.is/service-portal/core'

export type NotificationSidebarState = 'open' | 'closed'
export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export enum ActionType {
  SetUserPending = 'setUserPending',
  SetUserLoggedOut = 'setUserLoggedOut',
  SetUserFulfilled = 'setUserFulfilled',
  FetchSubjectListPending = 'fetchSubjectListPending',
  FetchSubjectListFulfilled = 'fetchSubjectListFulfilled',
  FetchSubjectListFailed = 'fetchSubjectListFailed',
  SetNotificationSidebarState = 'setNotificationSidebarState',
  SetRoutesFulfilled = 'setRoutesFulfilled',
}

export type Action =
  | { type: ActionType.SetUserPending }
  | { type: ActionType.SetUserLoggedOut }
  | { type: ActionType.SetUserFulfilled; payload: User }
  | { type: ActionType.FetchSubjectListPending }
  | { type: ActionType.FetchSubjectListFulfilled; payload: SubjectListDto[] }
  | { type: ActionType.FetchSubjectListFailed }
  | {
      type: ActionType.SetNotificationSidebarState
      payload: NotificationSidebarState
    }
  | {
      type: ActionType.SetRoutesFulfilled
      payload: ServicePortalRoute[]
    }

import { User } from 'oidc-client'
import { SubjectListDto } from '../mirage-server/models/subject'
import {
  ServicePortalRoute,
  LanguageCode,
} from '@island.is/service-portal/core'

export type NotificationMenuState = 'open' | 'closed'
export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export enum ActionType {
  SetUserPending = 'setUserPending',
  SetUserLoggedOut = 'setUserLoggedOut',
  SetUserFulfilled = 'setUserFulfilled',
  SetUserLoggingOut = 'setUserLoggingOut',
  FetchSubjectListPending = 'fetchSubjectListPending',
  FetchSubjectListFulfilled = 'fetchSubjectListFulfilled',
  FetchSubjectListFailed = 'fetchSubjectListFailed',
  SetNotificationMenuState = 'setNotificationMenuState',
  SetRoutesFulfilled = 'setRoutesFulfilled',
  SetLanguage = 'setLanguageFulfilled',
}

export type Action =
  | { type: ActionType.SetUserPending }
  | { type: ActionType.SetUserLoggedOut }
  | { type: ActionType.SetUserFulfilled; payload: User }
  | { type: ActionType.FetchSubjectListPending }
  | { type: ActionType.FetchSubjectListFulfilled; payload: SubjectListDto[] }
  | { type: ActionType.FetchSubjectListFailed }
  | {
      type: ActionType.SetNotificationMenuState
      payload: NotificationMenuState
    }
  | {
      type: ActionType.SetRoutesFulfilled
      payload: ServicePortalRoute[]
    }
  | {
      type: ActionType.SetLanguage
      payload: LanguageCode
    }
  | {
      type: ActionType.SetUserLoggingOut
    }

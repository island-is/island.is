import {
  ServicePortalModule,
  UserWithMeta,
} from '@island.is/service-portal/core'
import { SubjectListDto } from '../mirage-server/models/subject'
import { modules } from './modules'
import { mockSubjects, mockActors } from './mockData'
import {
  Action,
  ActionType,
  AsyncActionState,
  NotificationSidebarState,
} from './actions'

export interface StoreState {
  userInfo: UserWithMeta | null
  userInfoState: AsyncActionState
  modules: ServicePortalModule[]
  navigationState: AsyncActionState
  subjectList: SubjectListDto[]
  subjectListState: AsyncActionState
  notificationSidebarState: NotificationSidebarState
}

export const initialState: StoreState = {
  userInfo: null,
  userInfoState: 'passive',
  modules: modules,
  navigationState: 'passive',
  subjectList: [],
  subjectListState: 'passive',
  notificationSidebarState: 'closed',
}

export const reducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
    case ActionType.SetUserPending:
      return {
        ...state,
        userInfoState: 'pending',
      }
    case ActionType.SetUserFulfilled:
      return {
        ...state,
        userInfo: { user: action.payload, mockSubjects, mockActors },
        userInfoState: 'fulfilled',
      }
    case ActionType.FetchSubjectListPending:
      return {
        ...state,
        subjectListState: 'pending',
      }
    case ActionType.FetchSubjectListFulfilled:
      return {
        ...state,
        subjectListState: 'fulfilled',
        subjectList: action.payload,
      }
    case ActionType.FetchSubjectListFailed:
      return {
        ...state,
        subjectListState: 'failed',
      }
    case ActionType.SetNotificationSidebarState:
      return {
        ...state,
        notificationSidebarState: action.payload,
      }
    case ActionType.SetUserLoggedOut:
      return {
        ...initialState,
      }
    default:
      return state
  }
}

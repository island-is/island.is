import {
  ServicePortalModule,
  ServicePortalRoute,
  UserWithMeta,
  LanguageCode,
} from '@island.is/service-portal/core'
import { SubjectListDto } from '../mirage-server/models/subject'
import { modules } from './modules'
import { mockSubjects } from './mockData'
import {
  Action,
  ActionType,
  AsyncActionState,
  NotificationMenuState,
} from './actions'
import { determineInitialLocale, setLangInLocalStore } from '../utils/locale'

export interface StoreState {
  userInfo: UserWithMeta | null
  userInfoState: AsyncActionState | 'logging-out'
  modules: ServicePortalModule[]
  navigationState: AsyncActionState
  subjectList: SubjectListDto[]
  subjectListState: AsyncActionState
  notificationMenuState: NotificationMenuState
  routes: ServicePortalRoute[]
  lang: LanguageCode
}

export const initialState: StoreState = {
  userInfo: null,
  userInfoState: 'passive',
  modules: modules,
  navigationState: 'passive',
  subjectList: [],
  subjectListState: 'passive',
  notificationMenuState: 'closed',
  routes: [],
  lang: determineInitialLocale(),
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
        userInfo: { user: action.payload, mockSubjects },
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
    case ActionType.SetNotificationMenuState:
      return {
        ...state,
        notificationMenuState: action.payload,
      }
    case ActionType.SetUserLoggedOut:
      return {
        ...initialState,
      }
    case ActionType.SetRoutesFulfilled:
      return {
        ...state,
        routes: action.payload,
      }
    case ActionType.SetLanguage:
      setLangInLocalStore(action.payload)

      return {
        ...state,
        lang: action.payload,
      }
    case ActionType.SetUserLoggingOut:
      return {
        ...state,
        userInfoState: 'logging-out',
      }
    default:
      return state
  }
}

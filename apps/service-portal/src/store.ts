import { applicationsModule } from '@island.is/service-portal/applications'
import { documentsModule } from '@island.is/service-portal/documents'
import { settingsModule } from '@island.is/service-portal/settings'
import Cookies from 'js-cookie'

import {
  ServicePortalModule,
  ServicePortalNavigationItem,
} from '@island.is/service-portal/core'
import { SubjectListDto } from './mirage-server/models/subject'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import jwtDecode from 'jwt-decode'
import { JwtToken } from './mirage-server/models/jwt-model'

export interface Navigation {
  applications: ServicePortalNavigationItem | null
  documents: ServicePortalNavigationItem | null
  settings: ServicePortalNavigationItem | null
}

export interface SetNavigationPayload {
  navigation: Navigation
}

type NotificationSidebarState = 'open' | 'closed'

export type Action =
  | { type: 'setUserPending' }
  | { type: 'setUserFulfilled'; payload: JwtToken }
  | { type: 'fetchNavigationPending' }
  | { type: 'fetchNavigationFulfilled'; payload: SetNavigationPayload }
  | { type: 'fetchNavigationFailed' }
  | { type: 'fetchSubjectListPending' }
  | { type: 'fetchSubjectListFulfilled'; payload: SubjectListDto[] }
  | { type: 'fetchSubjectListFailed' }
  | { type: 'setNotificationSidebarState'; payload: NotificationSidebarState }

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export interface StoreState {
  userInfo: JwtToken | null
  userInfoState: AsyncActionState
  modules: {
    applicationsModule: ServicePortalModule
    documentsModule: ServicePortalModule
    settingsModule: ServicePortalModule
  }
  navigation: Navigation
  navigationState: AsyncActionState
  subjectList: SubjectListDto[]
  subjectListState: AsyncActionState
  notificationSidebarState: NotificationSidebarState
}

const authCookie = Cookies.get(MOCK_AUTH_KEY) as string

export const initialState: StoreState = {
  userInfo: authCookie ? jwtDecode(authCookie) : null,
  userInfoState: 'passive',
  modules: {
    applicationsModule,
    documentsModule,
    settingsModule,
  },
  navigation: {
    applications: null,
    documents: null,
    settings: null,
  },
  navigationState: 'passive',
  subjectList: [],
  subjectListState: 'passive',
  notificationSidebarState: 'open',
}

export const reducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
    case 'setUserPending':
      return {
        ...state,
        userInfoState: 'pending',
      }
    case 'setUserFulfilled':
      return {
        ...state,
        userInfo: action.payload,
        userInfoState: 'fulfilled',
      }
    case 'fetchNavigationPending':
      return {
        ...state,
        navigationState: 'pending',
      }
    case 'fetchNavigationFulfilled':
      return {
        ...state,
        navigation: action.payload.navigation,
        navigationState: 'fulfilled',
      }
    case 'fetchNavigationFailed':
      return {
        ...state,
        navigationState: 'failed',
      }
    case 'fetchSubjectListPending':
      return {
        ...state,
        subjectListState: 'pending',
      }
    case 'fetchSubjectListFulfilled':
      return {
        ...state,
        subjectListState: 'fulfilled',
        subjectList: action.payload,
      }
    case 'fetchSubjectListFailed':
      return {
        ...state,
        subjectListState: 'failed',
      }
    case 'setNotificationSidebarState':
      return {
        ...state,
        notificationSidebarState: action.payload,
      }
    default:
      return state
  }
}

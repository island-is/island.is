import { applicationsModule } from '@island.is/service-portal/applications'
import { documentsModule } from '@island.is/service-portal/documents'
import { settingsModule } from '@island.is/service-portal/settings'
import Cookies from 'js-cookie'

import {
  ServicePortalModule,
  ServicePortalNavigationItem,
} from '@island.is/service-portal/core'
import { Subject, SubjectListDto } from './mirage-server/models/subject'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import jwtDecode from 'jwt-decode'

export interface MockUserData {
  actor: {
    name: string
    nationalId: string
  }
  exp: string
  iat: string
  sub: Subject
}

export interface Navigation {
  applications: ServicePortalNavigationItem | null
  documents: ServicePortalNavigationItem | null
  settings: ServicePortalNavigationItem | null
}

export interface SetNavigationPayload {
  subjectId: string
  navigation: Navigation
}

export type Action =
  | { type: 'setUserPending' }
  | { type: 'setUser'; payload: MockUserData }
  | { type: 'fetchNavigationPending' }
  | { type: 'fetchNavigationFulfilled'; payload: SetNavigationPayload }
  | { type: 'fetchNavigationFailed' }
  | { type: 'fetchSubjectListPending' }
  | { type: 'fetchSubjectListFulfilled'; payload: SubjectListDto[] }
  | { type: 'fetchSubjectListFailed' }

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export interface StoreState {
  userInfo: MockUserData | null
  userInfoState: AsyncActionState
  modules: {
    applicationsModule: ServicePortalModule
    documentsModule: ServicePortalModule
    settingsModule: ServicePortalModule
  }
  navigation: Navigation
  navigationState: {
    subjectId: string | null
    state: AsyncActionState
  }
  subjectList: SubjectListDto[]
  subjectListState: AsyncActionState
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
  navigationState: {
    subjectId: null,
    state: 'passive',
  },
  subjectList: [],
  subjectListState: 'passive',
}

export const reducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
    case 'setUserPending':
      return {
        ...state,
        userInfoState: 'pending',
      }
    case 'setUser':
      return {
        ...state,
        userInfo: action.payload,
        userInfoState: 'fulfilled',
      }
    case 'fetchNavigationPending':
      return {
        ...state,
        navigationState: {
          ...state.navigationState,
          state: 'pending',
        },
      }
    case 'fetchNavigationFulfilled':
      return {
        ...state,
        navigation: action.payload.navigation,
        navigationState: {
          subjectId: action.payload.subjectId,
          state: 'fulfilled',
        },
      }
    case 'fetchNavigationFailed':
      return {
        ...state,
        navigationState: {
          ...state.navigationState,
          state: 'failed',
        },
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
    default:
      return state
  }
}

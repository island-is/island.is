import { applicationsModule } from '@island.is/service-portal/applications'
import { documentsModule } from '@island.is/service-portal/documents'

import {
  ServicePortalModule,
  ServicePortalNavigationItem,
} from '@island.is/service-portal/core'
import { Subject, SubjectListDto } from './mirage-server/models/subject'

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
}

export interface SetNavigationPayload {
  subjectId: string
  navigation: Navigation
}

export type Action =
  | { type: 'fetchingUser' }
  | { type: 'setUser'; payload: MockUserData }
  | { type: 'fetchNavigationPending' }
  | { type: 'fetchNavigationFulfilled'; payload: SetNavigationPayload }
  | { type: 'fetchNavigationFailed' }
  | { type: 'fetchSubjectListPending' }
  | { type: 'fetchSubjectListFulfilled'; payload: SubjectListDto[] }
  | { type: 'fetchSubjectListFailed' }
  | { type: 'setActiveSubjectId'; payload: string }

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export interface StoreState {
  userInfo: MockUserData | null
  userInfoState: AsyncActionState
  activeSubjectId: string | null
  modules: {
    applicationsModule: ServicePortalModule
    documentsModule: ServicePortalModule
  }
  navigation: Navigation
  navigationState: {
    subjectId: string | null
    state: AsyncActionState
  }
  subjectList: SubjectListDto[]
  subjectListState: AsyncActionState
}

export const initialState: StoreState = {
  userInfo: null,
  userInfoState: 'passive',
  activeSubjectId: null,
  modules: {
    applicationsModule,
    documentsModule,
  },
  navigation: {
    applications: null,
    documents: null,
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
    case 'fetchingUser':
      return {
        ...state,
        userInfoState: 'pending',
      }
    case 'setUser':
      return {
        ...state,
        userInfo: action.payload,
        userInfoState: 'fulfilled',
        /*
          Setting the user himself as the active subject by default
          Still undecided on how this will be handled
        */
        activeSubjectId:
          state.activeSubjectId === null
            ? action.payload.actor.nationalId
            : state.activeSubjectId,
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
    case 'setActiveSubjectId':
      return {
        ...state,
        activeSubjectId: action.payload,
      }
    default:
      return state
  }
}

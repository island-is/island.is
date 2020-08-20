import Cookies from 'js-cookie'

import {
  ServicePortalModule,
  ServicePortalNavigationRoot,
} from '@island.is/service-portal/core'
import { SubjectListDto } from '../mirage-server/models/subject'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import jwtDecode from 'jwt-decode'
import { modules } from './modules'
import {
  Log,
  User,
  UserManager,
  WebStorageStateStore,
  InMemoryWebStorage,
} from 'oidc-client'

type NotificationSidebarState = 'open' | 'closed'

export type Action =
  | { type: 'setUserPending' }
  | { type: 'setuserLoggedOut' }
  | { type: 'setUserFulfilled'; payload: User }
  | { type: 'fetchNavigationPending' }
  | { type: 'fetchNavigationFulfilled'; payload: ServicePortalNavigationRoot[] }
  | { type: 'fetchNavigationFailed' }
  | { type: 'fetchSubjectListPending' }
  | { type: 'fetchSubjectListFulfilled'; payload: SubjectListDto[] }
  | { type: 'fetchSubjectListFailed' }
  | { type: 'setNotificationSidebarState'; payload: NotificationSidebarState }

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export interface StoreState {
  userInfo: User
  userInfoState: AsyncActionState
  modules: ServicePortalModule[]
  navigation: ServicePortalNavigationRoot[]
  navigationState: AsyncActionState
  subjectList: SubjectListDto[]
  subjectListState: AsyncActionState
  notificationSidebarState: NotificationSidebarState
  userManager?: UserManager
}

const settings = {
  authority: 'https://siidentityserverweb20200805020732.azurewebsites.net/',
  // eslint-disable-next-line @typescript-eslint/camelcase
  client_id: 'island-is-1',
  // eslint-disable-next-line @typescript-eslint/camelcase
  silent_redirect_uri: `http://localhost:4200/silent/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  redirect_uri: `http://localhost:4200/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  response_type: 'code',
  revokeAccessTokenOnSignout: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
  scope: 'openid profile offline_access',
  userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
}

export const initialState: StoreState = {
  userInfo: null,
  userInfoState: 'passive',
  modules: modules,
  navigation: [],
  navigationState: 'passive',
  subjectList: [],
  subjectListState: 'passive',
  notificationSidebarState: 'open',
  userManager: new UserManager(settings),
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
        navigation: action.payload,
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
    case 'setuserLoggedOut':
      return {
        ...initialState
      }
    default:
      return state
  }
}

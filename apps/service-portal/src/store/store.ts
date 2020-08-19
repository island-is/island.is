import Cookies from 'js-cookie'

import { ServicePortalModule } from '@island.is/service-portal/core'
import { SubjectListDto } from '../mirage-server/models/subject'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import jwtDecode from 'jwt-decode'
import { JwtToken } from '../mirage-server/models/jwt-model'
import { modules } from './modules'

type NotificationSidebarState = 'open' | 'closed'

export type Action =
  | { type: 'setUserPending' }
  | { type: 'setUserFulfilled'; payload: JwtToken }
  | { type: 'fetchSubjectListPending' }
  | { type: 'fetchSubjectListFulfilled'; payload: SubjectListDto[] }
  | { type: 'fetchSubjectListFailed' }
  | { type: 'setNotificationSidebarState'; payload: NotificationSidebarState }

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export interface StoreState {
  userInfo: JwtToken | null
  userInfoState: AsyncActionState
  modules: ServicePortalModule[]
  navigationState: AsyncActionState
  subjectList: SubjectListDto[]
  subjectListState: AsyncActionState
  notificationSidebarState: NotificationSidebarState
}

const authCookie = Cookies.get(MOCK_AUTH_KEY) as string

export const initialState: StoreState = {
  userInfo: authCookie ? jwtDecode(authCookie) : null,
  userInfoState: 'passive',
  modules: modules,
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

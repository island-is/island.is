import { User } from 'oidc-client'
import { Dispatch, ReducerAction } from 'react'

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

export interface AuthReducerState {
  userInfo?: User
  userInfoState: AsyncActionState
  isAuthenticated: boolean
}

export enum ActionType {
  SIGNIN_START = 'SIGNIN_START',
  SIGNIN_SUCCESS = 'SIGNIN_SUCCESS',
  SIGNIN_FAILURE = 'SIGNIN_FAILURE',
  LOG_OUT = 'LOG_OUT',
  USER_LOADED = 'USER_LOADED',
}

interface Action {
  type: ActionType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

const USER_MOCKED = process.env.API_MOCKS === 'true'
export const initialState: AuthReducerState = USER_MOCKED
  ? {
      userInfo: ({
        profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
      } as unknown) as User,
      userInfoState: 'fulfilled',
      isAuthenticated: true,
    }
  : {
      userInfo: undefined,
      userInfoState: 'passive',
      isAuthenticated: false,
    }

export type AuthDispatch = Dispatch<Action>

export const reducer = (
  state: AuthReducerState,
  action: Action,
): AuthReducerState => {
  switch (action.type) {
    case ActionType.SIGNIN_START:
      return {
        ...state,
        userInfoState: 'pending',
      }
    case ActionType.SIGNIN_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        userInfoState: 'fulfilled',
        isAuthenticated: true,
      }
    case ActionType.USER_LOADED:
      return state.isAuthenticated
        ? {
            ...state,
            userInfo: action.payload,
          }
        : state
    case ActionType.SIGNIN_FAILURE:
      return {
        ...state,
        userInfoState: 'failed',
      }
    case ActionType.LOG_OUT:
      return {
        ...initialState,
      }
    default:
      return state
  }
}

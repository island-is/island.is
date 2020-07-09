export interface MockUserData {
  userInfo: {
    nationalId: string
    availableSubjects: {
      name: string
      email: string
      nationalId: string
      scopes: string[]
    }
  }
  name: ''
  modules: {
    name: string
  }[]
}

type Action = { type: 'fetchingUser' } | { type: 'setUser'; payload: object }

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

interface State {
  userInfo: MockUserData | null
  userInfoState: AsyncActionState
}

export const initialState: State = {
  userInfo: null,
  userInfoState: 'passive',
}

export const reducer = (state: State, action: Action) => {
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
      }

    default:
      return state
  }
}

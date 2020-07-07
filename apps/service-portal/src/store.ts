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

export type AsyncActionState = 'passive' | 'pending' | 'fulfilled' | 'failed'

interface State {
  userInfo: MockUserData | null
  userInfoState: AsyncActionState
}

export const initialState: State = {
  userInfo: null,
  userInfoState: 'passive',
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'fetchingToken':
      return {
        ...state,
        userInfoState: 'pending',
      }
    case 'setUserInfo':
      return {
        ...state,
        userInfo: action.payload,
        userInfoState: 'fulfilled',
      }

    default:
      return state
  }
}

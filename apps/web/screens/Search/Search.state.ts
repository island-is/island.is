import { Dispatch } from 'react'

export interface SearchReducerState {
  query: {
    q?: string
    processentry?: boolean
    type?: string[]
    category?: string[]
    organization?: string[]
  }
  searchLocked?: boolean
}

export enum ActionType {
  SET_PARAMS = 'SET_PARAMS',
  RESET_SEARCH = 'RESET_SEARCH',
}

interface Action {
  type: ActionType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

export const initialState: SearchReducerState = {
  query: {
    q: '',
    processentry: false,
    type: [],
    category: [],
    organization: [],
  },
  searchLocked: true,
}

export type AuthDispatch = Dispatch<Action>

export const reducer = (
  state: SearchReducerState,
  action: Action,
): SearchReducerState => {
  switch (action.type) {
    case ActionType.SET_PARAMS:
      return {
        ...state,
        ...action.payload,
        query: {
          ...state.query,
          ...action.payload.query,
        },
        searchLocked: false,
      }
    case ActionType.RESET_SEARCH:
      return {
        ...initialState,
        query: {
          ...initialState.query,
          q: state.query.q,
        },
        searchLocked: false,
      }
    default:
      return state
  }
}

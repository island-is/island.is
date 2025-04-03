import { UPDATE_ELECTION_ACTION } from '../../utils/constants'

type ElectionState = { name?: string; year?: string }

type ElectionAction = {
  type: string
  payload: { name?: string; year?: string }
}

export const electionInitialState = {
  name: '',
  year: '',
}

export const electionReducer = (
  state: ElectionState,
  action: ElectionAction,
) => {
  switch (action.type) {
    case UPDATE_ELECTION_ACTION:
      return {
        ...state,
        name: action.payload.name,
        year: action.payload.year,
      }
    default:
      return state
  }
}

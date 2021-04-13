import { Dispatch, useEffect, useState } from 'react'
import {
  Action,
  ActionTypes,
  ApplicationUIState,
} from '../reducer/ReducerTypes'
import { useHistory } from 'react-router-dom'

interface HistoryState {
  state: string
  screen: number
  historyReason: 'initial' | 'navigate' | 'pop'
}

export const useHistorySync = (
  state: ApplicationUIState,
  dispatch: Dispatch<Action>,
) => {
  const history = useHistory<HistoryState>()

  // Set up history state.
  const [lastHistoryState, setLastHistoryState] = useState<HistoryState>({
    state: state.application.state,
    screen: state.activeScreen,
    historyReason: 'initial',
  })

  // Check for changes to history state.
  if (
    state.application.state !== lastHistoryState.state ||
    state.activeScreen !== lastHistoryState.screen
  ) {
    setLastHistoryState({
      state: state.application.state,
      screen: state.activeScreen,
      historyReason: state.historyReason,
    })
  }

  // Act on history state.
  useEffect(() => {
    if (!history) {
      return
    }
    const location = `${history.location.pathname}${history.location.search}${history.location.hash}`
    if (lastHistoryState.historyReason === 'navigate') {
      history.push(location, lastHistoryState)
    } else if (lastHistoryState.historyReason === 'initial') {
      history.replace(location, lastHistoryState)
    }
  }, [history, lastHistoryState])

  // Listen for browser navigation.
  useEffect(() => {
    if (!history) {
      return
    }
    return history.listen(({ state: payload }, action) => {
      if (
        action === 'POP' &&
        payload?.screen != null &&
        payload?.state != null
      ) {
        dispatch({ type: ActionTypes.HISTORY_POP, payload })
      }
    })
  }, [history, dispatch])
}

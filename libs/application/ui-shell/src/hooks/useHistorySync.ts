import { Dispatch, useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import {
  Action,
  ActionTypes,
  ApplicationUIState,
} from '../reducer/ReducerTypes'

interface HistoryState {
  state: string
  screen: number
  historyReason: 'initial' | 'navigate' | 'pop'
}

export const useHistorySync = (
  state: ApplicationUIState,
  dispatch: Dispatch<Action>,
) => {
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const location = useLocation()
  const locationRef = useRef(location)

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
    const { pathname, search, hash } = locationRef.current
    const url = `${pathname}${search}${hash}`
    const { historyReason } = lastHistoryState

    if (historyReason === 'navigate' || historyReason === 'initial') {
      navigate(url, {
        state: lastHistoryState,
        replace: historyReason === 'initial',
      })
    }
  }, [lastHistoryState, locationRef, navigate])

  // Listen for browser navigation change.
  useEffect(() => {
    const { state } = locationRef.current

    if (navigationType === 'POP' && state !== null && state.screen !== null) {
      dispatch({ type: ActionTypes.HISTORY_POP, payload: state })
    }
  }, [navigationType, dispatch, state])
}

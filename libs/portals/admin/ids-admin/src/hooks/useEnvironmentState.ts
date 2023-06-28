import { Dispatch, SetStateAction, useState } from 'react'

import { useEnvironment } from '../context/EnvironmentContext'

/**
 * This hook is like useState but re-initializes each time the selected
 * environment changes. This is useful for storing mutable form data for the
 * selected environment. That way other component state (like tabs and
 * accordions) is not reset when the environment changes, only the form data.
 */
export const useEnvironmentState = <S>(
  initialState: S,
): [S, Dispatch<SetStateAction<S>>] => {
  const [state, setState] = useState(initialState)
  const { selectedEnvironment } = useEnvironment()
  const [prevEnvironment, setPrevEnvironment] = useState(selectedEnvironment)

  if (selectedEnvironment !== prevEnvironment) {
    setState(initialState)
    setPrevEnvironment(selectedEnvironment)
  }

  return [state, setState]
}

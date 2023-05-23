import { Dispatch, SetStateAction, useContext, useState } from 'react'

import { EnvironmentContext } from '../context/EnvironmentContext'

/**
 * This hook is like useState but re-initializes each time the selected
 * environment changes. This is useful for storing mutable form data for the
 * selected environment. That way other component state (like tabs and
 * accordions) is not reset when the environment changes, only the form data.
 */
export const useEnvironmentState = <S>(
  initialState: S,
): [S, Dispatch<SetStateAction<S>>] => {
  const context = useContext(EnvironmentContext)

  if (!context) {
    throw new Error(
      'useEnvironmentState must be used within a EnvironmentProvider',
    )
  }

  const { selectedEnvironment } = context

  const [state, setState] = useState(initialState)
  const [prevEnvironment, setPrevEnvironment] = useState(selectedEnvironment)

  if (selectedEnvironment !== prevEnvironment) {
    setState(initialState)
    setPrevEnvironment(selectedEnvironment)
  }

  return [state, setState]
}

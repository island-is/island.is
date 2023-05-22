import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { usePrevious } from 'react-use'
import { ClientContext } from '../context/ClientContext'

/**
 * This hook is like useState but re-initializes each time the selected
 * environment changes. This is useful for storing mutatable form data for the
 * selected environment. That way other component state (like tabs and
 * accordions) is not reset when the environment changes, only the form data.
 */
export const useEnvironmentState = <S>(
  initialState: S,
): [S, Dispatch<SetStateAction<S>>] => {
  const { selectedEnvironment } = useContext(ClientContext)
  const [state, setState] = useState(initialState)
  const [prevEnvironment, setPrevEnvironment] = useState(selectedEnvironment)

  if (selectedEnvironment.environment !== prevEnvironment.environment) {
    setState(initialState)
    setPrevEnvironment(selectedEnvironment)
  }

  return [state, setState]
}

import { useEffectOnce } from '@island.is/react-spa/shared'
import { ReactNode, useCallback, useReducer } from 'react'

import { LoadingScreen } from '@island.is/react/components'
import { createBffUrlGenerator } from './bff.utils'
import { BffContext } from './BffContext'
import { ErrorScreen } from './ErrorScreen'
import { reducer, initialState, ActionType } from './bff.state'

type BffProviderProps = {
  children: ReactNode
  /**
   * The base path of the application.
   */
  applicationBasePath: string
}

export const BffProvider = ({
  children,
  applicationBasePath,
}: BffProviderProps) => {
  const bffUrlGenerator = createBffUrlGenerator(applicationBasePath)
  const [state, dispatch] = useReducer(reducer, initialState)

  const checkLogin = async () => {
    dispatch({
      type: ActionType.SIGNIN_START,
    })

    try {
      const res = await fetch(bffUrlGenerator('/user'), {
        credentials: 'include',
      })

      if (!res.ok) {
        dispatch({
          type: ActionType.SIGNIN_FAILURE,
        })

        window.location.href = bffUrlGenerator('/login')

        return
      }

      const user = await res.json()

      dispatch({
        type: ActionType.SIGNIN_SUCCESS,
        payload: user,
      })
    } catch (error) {
      dispatch({
        type: ActionType.ERROR,
        payload: error,
      })
    }
  }

  const signIn = useCallback(() => {
    window.location.href = bffUrlGenerator('/login')
  }, [bffUrlGenerator])

  const signOut = useCallback(() => {
    if (!state.userInfo) {
      return
    }

    window.location.href = bffUrlGenerator(
      `/logout?sid=${state.userInfo.profile.sid}`,
    )
  }, [bffUrlGenerator, state.userInfo])

  const switchUser = useCallback((_nationalId?: string) => {
    // TODO
  }, [])

  useEffectOnce(() => {
    checkLogin()
  })

  const onRetry = () => {
    window.location.href = applicationBasePath
  }

  const { authState } = state
  const showErrorScreen = authState === 'error'
  const showLoadingScreen = authState === 'loading' || authState === 'switching'
  const isLoggedIn = authState === 'logged-in'

  return (
    <BffContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        switchUser,
      }}
    >
      {isLoggedIn && <button onClick={signOut}>Logout</button>}
      {showErrorScreen ? (
        <ErrorScreen onRetry={onRetry} />
      ) : showLoadingScreen ? (
        <LoadingScreen ariaLabel="Er að vinna í innskráningu" />
      ) : isLoggedIn ? (
        children
      ) : null}
    </BffContext.Provider>
  )
}

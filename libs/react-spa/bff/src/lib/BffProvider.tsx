import { useEffectOnce } from '@island.is/react-spa/shared'
import { ReactNode, useCallback, useReducer } from 'react'

import { LoadingScreen } from '@island.is/react/components'
import { createBffUrlGenerator, createQueryStr } from './bff.utils'
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
        signIn()

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
    const qs = createQueryStr({
      target_link_uri: window.location.href,
    })

    window.location.href = bffUrlGenerator(`/login?${qs}`)
  }, [bffUrlGenerator])

  const signOut = useCallback(() => {
    if (!state.userInfo) {
      return
    }

    dispatch({
      type: ActionType.LOGGING_OUT,
    })

    window.location.href = bffUrlGenerator(
      `/logout?sid=${state.userInfo.profile.sid}`,
    )
  }, [bffUrlGenerator, state.userInfo])

  const switchUser = (nationalId?: string) => {
    dispatch({
      type: ActionType.SWITCH_USER,
    })

    const qs = createQueryStr(
      nationalId !== undefined
        ? {
            login_hint: nationalId,
            /**
             * TODO: remove this.
             * It is currently required to switch delegations, but we'd like
             * the IDS to handle login_required and other potential road
             * blocks. Now OidcSignIn is handling login_required.
             */
            prompt: 'none',
          }
        : {
            prompt: 'select_account',
          },
    )

    window.location.href = bffUrlGenerator(`/login?${qs}`)
  }

  const checkQueryStringError = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('bff_error_code')
    const errorDescription = urlParams.get('bff_error_description')

    if (error) {
      dispatch({
        type: ActionType.ERROR,
        payload: new Error(`${error}: ${errorDescription}`),
      })
    }

    // Returns true if there is an error
    return !!error
  }

  useEffectOnce(() => {
    const hasError = checkQueryStringError()

    if (!hasError) {
      checkLogin()
    }
  })

  const onRetry = () => {
    window.location.href = applicationBasePath
  }

  const { authState } = state
  const showErrorScreen = authState === 'error'
  const showLoadingScreen =
    authState === 'loading' ||
    authState === 'switching' ||
    authState === 'logging-out'
  const isLoggedIn = authState === 'logged-in'

  return (
    <BffContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        switchUser,
        bffUrlGenerator,
      }}
    >
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

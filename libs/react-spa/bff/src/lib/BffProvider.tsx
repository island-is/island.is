import { useEffectOnce } from '@island.is/react-spa/shared'
import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react'

import { LoadingScreen } from '@island.is/react/components'
import { createBffUrlGenerator, isNewSession } from './bff.utils'
import { BffContext } from './BffContext'
import { ErrorScreen } from './ErrorScreen'
import { reducer, initialState, ActionType } from './bff.state'
import { BffPoller } from './BffPoller'
import { BffBroadcastEvents, useBffBroadcaster } from './bff.hooks'
import { BffSessionExpiredModal } from './BffSessionExpiredModal'

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
  const [showSessionExpiredScreen, setSessionExpiredScreen] = useState(false)
  const bffUrlGenerator = createBffUrlGenerator(applicationBasePath)
  const [state, dispatch] = useReducer(reducer, initialState)
  const isLoggedIn = state.authState === 'logged-in'

  const { postMessage } = useBffBroadcaster((event) => {
    if (
      isLoggedIn &&
      event.data.type === BffBroadcastEvents.NEW_SESSION &&
      isNewSession(state.userInfo, event.data.userInfo)
    ) {
      setSessionExpiredScreen(true)
    }
  })

  useEffect(() => {
    if (isLoggedIn) {
      // Broadcast to all tabs/windows/iframes that a new session has started
      postMessage({
        type: BffBroadcastEvents.NEW_SESSION,
        userInfo: state.userInfo,
      })
    }
  }, [postMessage, state.userInfo, isLoggedIn])

  const checkLogin = async (noRefresh = false) => {
    dispatch({
      type: ActionType.SIGNIN_START,
    })

    try {
      const url = bffUrlGenerator('/user', {
        no_refresh: noRefresh.toString(),
      })

      const res = await fetch(url, {
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
    window.location.href = bffUrlGenerator('/login', {
      target_link_uri: window.location.href,
    })
  }, [bffUrlGenerator])

  const signOut = useCallback(() => {
    if (!state.userInfo) {
      return
    }

    dispatch({
      type: ActionType.LOGGING_OUT,
    })

    window.location.href = bffUrlGenerator('/logout', {
      sid: state.userInfo.profile.sid,
    })
  }, [bffUrlGenerator, state.userInfo])

  const switchUser = (nationalId?: string) => {
    dispatch({
      type: ActionType.SWITCH_USER,
    })

    window.location.href = bffUrlGenerator(
      '/login',
      nationalId
        ? {
            login_hint: nationalId,
          }
        : {
            prompt: 'select_account',
          },
    )
  }

  useEffectOnce(() => {
    checkLogin()
  })

  useEffectOnce(() => {
    const oneHourMs = 1000 * 60 * 60
    const timeout = setTimeout(() => {
      // After one hour we check if the user is still logged in
      // and we tell the /user endpoint not to refresh the tokens,
      // since we are checking for timeout expiration.
      checkLogin(true)
    }, oneHourMs)

    return () => {
      clearTimeout(timeout)
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
      ) : showSessionExpiredScreen ? (
        <BffSessionExpiredModal onLogin={signIn} />
      ) : isLoggedIn ? (
        <BffPoller
          newSessionCb={() => {
            setSessionExpiredScreen(true)
          }}
        >
          {children}
        </BffPoller>
      ) : null}
    </BffContext.Provider>
  )
}

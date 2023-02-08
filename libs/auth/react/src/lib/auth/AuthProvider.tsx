import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
  useState,
} from 'react'
import type { User } from 'oidc-client-ts'
import { getAuthSettings, getUserManager } from '../userManager'
import { ActionType, initialState, reducer } from './Auth.state'
import { AuthSettings } from '../AuthSettings'
import { AuthContext } from './AuthContext'
import { AuthErrorScreen } from './AuthErrorScreen'
import { CheckIdpSession } from './CheckIdpSession'
import { isDefined } from '@island.is/shared/utils'
import { LoadingScreen } from '@island.is/react/components'

interface AuthProviderProps {
  /**
   * If true, Authenticator automatically starts login flow and does not render children until user is fully logged in.
   * If false, children are responsible for rendering a login button and loading indicator.
   * Default: true
   */
  autoLogin?: boolean
  /**
   * The base path of the application.
   */
  basePath: string
  children: ReactNode
}

type GetReturnUrl = {
  basePath: string
  returnUrl: string
} & Pick<AuthSettings, 'redirectPath'>

const getReturnUrl = ({ redirectPath, basePath, returnUrl }: GetReturnUrl) => {
  if (redirectPath && returnUrl.startsWith(redirectPath)) {
    return basePath
  }

  return returnUrl
}

const getCurrentUrl = () =>
  `${window.location.pathname}${window.location.search}`

export const AuthProvider = ({
  children,
  autoLogin = true,
  basePath,
}: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [hasError, setHasError] = useState(false)
  const userManager = getUserManager()
  const authSettings = getAuthSettings()
  const monitorUserSession = !authSettings.scope?.includes('offline_access')
  const url = getCurrentUrl()

  const signIn = useCallback(
    async function signIn() {
      dispatch({
        type: ActionType.SIGNIN_START,
      })

      return userManager.signinRedirect({
        state: getReturnUrl({
          returnUrl: url,
          basePath,
          redirectPath: authSettings.redirectPath,
        }),
      })
      // Nothing more happens here since browser will redirect to IDS.
    },
    [dispatch, userManager, authSettings, url],
  )

  const signInSilent = useCallback(
    async function signInSilent() {
      let user = null
      dispatch({
        type: ActionType.SIGNIN_START,
      })
      try {
        user = await userManager.signinSilent()
        dispatch({ type: ActionType.SIGNIN_SUCCESS, payload: user })
      } catch (error) {
        console.error('AuthProvider: Silent signin failed', error)
        dispatch({ type: ActionType.SIGNIN_FAILURE })
      }

      return user
    },
    [userManager, dispatch],
  )

  const switchUser = useCallback(
    async function switchUser(nationalId?: string) {
      const args =
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
            }

      dispatch({
        type: ActionType.SWITCH_USER,
      })

      return userManager.signinRedirect({
        state:
          authSettings.switchUserRedirectUrl ??
          getReturnUrl({
            returnUrl: getCurrentUrl(),
            basePath,
            redirectPath: authSettings.redirectPath,
          }),
        ...args,
      })
      // Nothing more happens here since browser will redirect to IDS.
    },
    [userManager, dispatch, authSettings, url],
  )

  const signOut = useCallback(
    async function signOut() {
      dispatch({
        type: ActionType.LOGGING_OUT,
      })
      await userManager.signoutRedirect()
    },
    [userManager, dispatch],
  )

  const checkLogin = useCallback(
    async function checkLogin() {
      dispatch({
        type: ActionType.SIGNIN_START,
      })
      const storedUser = await userManager.getUser()

      // Check expiry.
      if (storedUser && !storedUser.expired) {
        dispatch({
          type: ActionType.SIGNIN_SUCCESS,
          payload: storedUser,
        })
      } else if (autoLogin) {
        // If we find a user in SessionStorage, there's a fine chance that
        // it's just an expired token, and we can silently log in.
        if (storedUser && (await signInSilent())) {
          return
        }

        // If all else fails, redirect to the login page.
        await signIn()
      } else {
        // When not performing autologin, silently check if there's an IDP session.
        await signInSilent()
      }
    },
    [userManager, dispatch, signIn, signInSilent, autoLogin],
  )

  useEffect(() => {
    // Only add events when we have userInfo, to avoid race conditions with
    // oidc hooks.
    if (state.userInfo === null) {
      return
    }

    // This is raised when a new user state has been loaded with a silent login.
    const userLoaded = (user: User) => {
      dispatch({
        type: ActionType.USER_LOADED,
        payload: user,
      })
    }

    // This is raised when the user is signed out of the IDP.
    const userSignedOut = async () => {
      dispatch({
        type: ActionType.LOGGED_OUT,
      })
      await userManager.removeUser()

      if (autoLogin) {
        signIn()
      }
    }

    userManager.events.addUserLoaded(userLoaded)
    userManager.events.addUserSignedOut(userSignedOut)
    return () => {
      userManager.events.removeUserLoaded(userLoaded)
      userManager.events.removeUserSignedOut(userSignedOut)
    }
  }, [dispatch, userManager, signIn, autoLogin, state.userInfo === null])

  const isCurrentRoute = (path?: string) =>
    isDefined(path) && url.includes(basePath + path)

  const init = async () => {
    if (isCurrentRoute(authSettings?.redirectPath)) {
      try {
        const user = await userManager.signinRedirectCallback(
          window.location.href,
        )

        const url = typeof user.state === 'string' ? user.state : '/'
        window.history.replaceState(null, '', url)

        dispatch({
          type: ActionType.SIGNIN_SUCCESS,
          payload: user,
        })
      } catch (error) {
        if (error.error === 'login_required') {
          // If trying to switch delegations and the IDS session is expired, we'll
          // see this error. So we'll try a proper signin.
          return userManager.signinRedirect({ state: error.state })
        }
        console.error('Error in oidc callback', error)
        setHasError(true)
      }
    } else if (isCurrentRoute(authSettings?.redirectPathSilent)) {
      const userManager = getUserManager()
      userManager.signinSilentCallback().catch((error) => {
        // TODO: Handle error
        console.log(error)
      })
    } else {
      checkLogin()
    }
  }

  useEffect(() => {
    init()
  }, [])

  const context = useMemo(
    () => ({
      ...state,
      signIn,
      signInSilent,
      switchUser,
      signOut,
    }),
    [state, signIn, signInSilent, switchUser, signOut],
  )

  const isLoading =
    !state.userInfo ||
    // We need to display loading screen if current route is the redirectPath or redirectPathSilent.
    // This is because these paths are not part of our React Router routes.
    isCurrentRoute(authSettings?.redirectPath) ||
    isCurrentRoute(authSettings?.redirectPathSilent)

  return (
    <AuthContext.Provider value={context}>
      {hasError ? (
        <AuthErrorScreen basePath={basePath} />
      ) : isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {monitorUserSession && <CheckIdpSession />}
          {children}
        </>
      )}
    </AuthContext.Provider>
  )
}

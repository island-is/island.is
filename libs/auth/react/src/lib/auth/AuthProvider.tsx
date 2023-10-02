import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
  useState,
} from 'react'
import type { User } from 'oidc-client-ts'

import { useEffectOnce } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import { LoadingScreen } from '@island.is/react/components'

import { getAuthSettings, getUserManager } from '../userManager'
import { ActionType, initialState, reducer } from './Auth.state'
import { AuthSettings } from '../AuthSettings'
import { AuthContext } from './AuthContext'
import { AuthErrorScreen } from './AuthErrorScreen'
import { CheckIdpSession } from './CheckIdpSession'

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
  returnUrl: string
} & Pick<AuthSettings, 'redirectPath'>

const isCurrentRoute = (url: string, path?: string) =>
  isDefined(path) && url.startsWith(path)

const getReturnUrl = ({ redirectPath, returnUrl }: GetReturnUrl) => {
  if (redirectPath && returnUrl.startsWith(redirectPath)) {
    return '/'
  }

  return returnUrl
}

const getCurrentUrl = (basePath: string) => {
  const url = `${window.location.pathname}${window.location.search}${window.location.hash}`

  if (url.startsWith(basePath)) {
    return url.slice(basePath.length)
  }

  return '/'
}

export const AuthProvider = ({
  children,
  autoLogin = true,
  basePath,
}: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [error, setError] = useState<Error | undefined>()
  const userManager = getUserManager()
  const authSettings = getAuthSettings()
  const monitorUserSession = !authSettings.scope?.includes('offline_access')

  const signIn = useCallback(
    async function signIn() {
      dispatch({
        type: ActionType.SIGNIN_START,
      })

      try {
        return userManager.signinRedirect({
          state: getReturnUrl({
            returnUrl: getCurrentUrl(basePath),
            redirectPath: authSettings.redirectPath,
          }),
        })
      } catch (e) {
        console.error('Error in signinRedirect', e)
        setError(e)
      }
      // Nothing more happens here since browser will redirect to IDS.
    },
    [dispatch, userManager, authSettings, basePath],
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
            returnUrl: getCurrentUrl(basePath),
            redirectPath: authSettings.redirectPath,
          }),
        ...args,
      })
      // Nothing more happens here since browser will redirect to IDS.
    },
    [userManager, dispatch, authSettings, basePath],
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

  const hasUserInfo = state.userInfo !== null
  useEffect(() => {
    // Only add events when we have userInfo, to avoid race conditions with
    // oidc hooks.
    if (!hasUserInfo) {
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
  }, [dispatch, userManager, signIn, autoLogin, hasUserInfo])

  const init = async () => {
    const currentUrl = getCurrentUrl(basePath)

    if (isCurrentRoute(currentUrl, authSettings.redirectPath)) {
      try {
        const user = await userManager.signinRedirectCallback(
          window.location.href,
        )

        const url = typeof user.state === 'string' ? user.state : '/'
        window.history.replaceState(null, '', basePath + url)

        dispatch({
          type: ActionType.SIGNIN_SUCCESS,
          payload: user,
        })
      } catch (e) {
        if (e.error === 'login_required') {
          // If trying to switch delegations and the IDS session is expired, we'll
          // see this error. So we'll try a proper signin.
          return userManager.signinRedirect({ state: e.state })
        }
        console.error('Error in oidc callback', e)
        setError(e)
      }
    } else if (isCurrentRoute(currentUrl, authSettings.redirectPathSilent)) {
      const userManager = getUserManager()
      userManager.signinSilentCallback().catch((e) => {
        console.log(e)
        setError(e)
      })
    } else if (isCurrentRoute(currentUrl, authSettings.initiateLoginPath)) {
      const userManager = getUserManager()
      const searchParams = new URL(window.location.href).searchParams

      const loginHint = searchParams.get('login_hint')
      const targetLinkUri = searchParams.get('target_link_uri')
      const path =
        targetLinkUri &&
        authSettings.baseUrl &&
        targetLinkUri.startsWith(authSettings.baseUrl)
          ? targetLinkUri.slice(authSettings.baseUrl.length)
          : '/'
      let prompt = searchParams.get('prompt')
      prompt =
        prompt && ['login', 'select_account'].includes(prompt) ? prompt : null

      const args = {
        state: path,
        prompt: prompt ?? undefined,
        login_hint: loginHint ?? undefined,
      }
      userManager.signinRedirect(args)
    } else {
      checkLogin()
    }
  }

  useEffectOnce(() => {
    init()
  })

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

  const url = getCurrentUrl(basePath)
  const isLoading =
    !state.userInfo ||
    // We need to display loading screen if current route is the redirectPath or redirectPathSilent.
    // This is because these paths are not part of our React Router routes.
    isCurrentRoute(url, authSettings?.redirectPath) ||
    isCurrentRoute(url, authSettings?.redirectPathSilent)

  const onRetry = () => {
    window.location.href = basePath
  }

  return (
    <AuthContext.Provider value={context}>
      {error ? (
        <AuthErrorScreen onRetry={onRetry} />
      ) : isLoading ? (
        <LoadingScreen ariaLabel="Er að vinna í innskráningu" />
      ) : (
        <>
          {monitorUserSession && <CheckIdpSession />}
          {children}
        </>
      )}
    </AuthContext.Provider>
  )
}

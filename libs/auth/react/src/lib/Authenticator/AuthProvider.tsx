import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  ReactNode,
} from 'react'
import { Location, useLocation } from 'react-router-dom'
import type { User } from 'oidc-client-ts'

import { getAuthSettings, getUserManager } from '../userManager'
import { ActionType, initialState, reducer } from './Authenticator.state'
import { AuthSettings } from '../AuthSettings'
import { AuthContext } from './AuthContext'

interface AuthProviderProps {
  /**
   * If true, Authenticator automatically starts login flow and does not render children until user is fully logged in.
   * If false, children are responsible for rendering a login button and loading indicator.
   * Default: true
   */
  autoLogin?: boolean
  children: ReactNode
}

const getReturnUrl = (location: Location, { redirectPath }: AuthSettings) => {
  const returnUrl = location.pathname + location.search

  if (redirectPath && returnUrl.startsWith(redirectPath)) {
    return '/'
  }

  return returnUrl
}

export const AuthProvider = ({
  children,
  autoLogin = true,
}: AuthProviderProps) => {
  console.log('AuthProvider')
  const [state, dispatch] = useReducer(reducer, initialState)
  const userManager = getUserManager()
  const authSettings = getAuthSettings()
  const location = useLocation()
  const locationRef = useRef(location)
  locationRef.current = location

  const signIn = useCallback(async () => {
    dispatch({
      type: ActionType.SIGNIN_START,
    })
    return userManager.signinRedirect({
      state: getReturnUrl(locationRef.current, authSettings),
    })
    // Nothing more happens here since browser will redirect to IDS.
  }, [dispatch, userManager, authSettings, locationRef])

  const signInSilent = useCallback(async () => {
    let user = null
    dispatch({
      type: ActionType.SIGNIN_START,
    })
    try {
      user = await userManager.signinSilent()
      dispatch({ type: ActionType.SIGNIN_SUCCESS, payload: user })
    } catch (error) {
      console.error('Authenticator: Silent signin failed', error)
      dispatch({ type: ActionType.SIGNIN_FAILURE })
    }

    return user
  }, [userManager, dispatch])

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
          getReturnUrl(locationRef.current, authSettings),
        ...args,
      })
      // Nothing more happens here since browser will redirect to IDS.
    },
    [userManager, dispatch, authSettings, locationRef],
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

  const checkLogin = useCallback(async () => {
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
  }, [userManager, dispatch, signIn, signInSilent, autoLogin])

  useEffect(() => {
    // Only add events when we have userInfo, to avoid race conditions with
    // oidc hooks.
    if (state.userInfo === null) {
      return
    }

    // This is raised when a new user state has been loaded with a silent login.
    const userLoaded = (user: User) => {
      console.log('userLoader', user)
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

  return (
    <AuthContext.Provider
      value={{
        ...context,
        dispatch,
        authSettings,
        checkLogin,
        autoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

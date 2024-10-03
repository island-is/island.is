```ts
/**
 * Utility functions, types, and callbacks for NextAuth used by IdentityServer (Ids).
 */

import { Session, User, RequestInternal } from 'next-auth'
import { DefaultJWT, JWT } from 'next-auth/jwt'
import { FetchOptions, GenericObject } from 'next-auth/_utils'

/**
 * Adds next_redirect query parameter to a given URL.
 *
 * @param url - The URL string to which the next_redirect parameter will be added.
 * @param nextRedirect - The next redirect URL.
 * @returns Updated URL string containing the next_redirect parameter.
 */
export function addNextRedirectToUrl(
  url: string,
  nextRedirect: string,
): string {
  const urlWithQuery = new URL(url)
  urlWithQuery.searchParams.set('next_redirect', nextRedirect)
  return urlWithQuery.toString()
}

export type PartialSession = Pick<Session, 'expires' | 'user'> & {
  error?: 'RefreshAccessTokenError'
  user?: {
    email: string
    name: string
    image: string
    id: string
    isAdmin: boolean
  }
}

/**
 * Partial interface for the NextAuth JWT. It contains relevant fields required for the library.
 */
export interface PartialNextAuthDefaultJWT
  extends Pick<DefaultJWT, 'email' | 'name' | 'picture'> {
  idToken?: string
  accessToken: string
  refreshToken: string
  accessTokenExpires: number
  userPrincipalName: string
  userId: string
  id?: string
  idp:
    | 'apple'
    | 'azure-ad'
    | 'b2c-facebook'
    | 'facebook'
    | 'github'
    | 'google'
    | 'keycloak'
    | 'twitter'
}

/**
 * Represents a user token used in JWT operations.
 */
export type Token = JWT & PartialNextAuthDefaultJWT

/**
 * Refreshes an access token using the provided token information.
 *
 * @param token - Object containing current token and related information.
 * @returns Promise resolving to a partial JWT with refreshed token information.
 */
export async function refreshAccessToken(token: Token): Promise<Partial<JWT>> {
  try {
    const url =
      'https://ids.matnbaz.net/auth/realms/Matnbaz/protocol/openid-connect/token'

    const details: GenericObject<string> = {
      client_id: 'next-js',
      client_secret: process.env.OIDC_CLIENT_SECRET as string,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
    }

    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(details[key]),
      )
      .join('&')

    const requestBody: RequestInit & FetchOptions = {
      body: formBody,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cache: 'default',
      credentials: 'same-origin',
      mode: 'cors',
      redirect: 'manual',
      referrer: 'no-referrer',
    }

    const response = await fetch(url, requestBody)

    if (!response.ok) {
      throw new Error('Failed to refresh access token')
    }

    const refreshedTokens: {
      access_token: string
      expires_in: number
      refresh_expires_in: number
      refresh_token: string
      scope: string
      token_type: string
      'not-before-policy': number
      session_state: string
      id_token: string
    } = await response.json()

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Error refreshing access token: ', error)

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

/**
 * Extracts the User Principal Name (UPN) from the user or session object.
 *
 * @param userOrSession - Partial user or session object containing UPN information.
 * @returns User principal name as a string.
 */
export function extractUserPrincipalName(
  userOrSession: Partial<User | ({ idToken?: string } & Partial<Session>)>,
) {
  if ('user' in userOrSession) {
    return userOrSession.user?.email || null
  } else if ('idToken' in userOrSession) {
    const idTokenDecoded = Buffer.from(
      userOrSession.idToken!.split('.')[1],
      'base64',
    ).toString('utf8')
    const { email } = JSON.parse(idTokenDecoded)
    return email || null
  }
  return null
}
```

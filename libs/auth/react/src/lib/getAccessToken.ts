import { getUserManager } from './userManager'
import { tinyMemoize } from './utils/tinyMemoize'

// Should not use access tokens that are expired or just about to expire.
// Get a new one just in case.
export const MIN_EXPIRY_FOR_RE_SIGNIN = 10

// If we call an API a couple of minutes before an access token, we assume
// the user is still around and actively using the client. Then we prefetch a
// new access token before it expires, to avoid request delays.
export const MIN_EXPIRY_FOR_PRE_SIGNIN = 120

const fetchNewToken = tinyMemoize(() => {
  // This can fail if IDP session is finished. This is ignored here and dealt
  // with in Authenticator.
  return getUserManager()
    .signinSilent()
    .catch(() => null)
})

export const getAccessToken = async () => {
  let user = await getUserManager().getUser()
  if (!user) {
    return null
  }

  // Token is either expired, or just about to expire. We should get a new
  // token either way.
  if (!user.expires_in || user.expires_in < MIN_EXPIRY_FOR_RE_SIGNIN) {
    user = await fetchNewToken()
    if (!user) {
      return null
    }
  }

  // We're still active but the token will expire soon. We'll make sure to
  // prefetch a new token for later.
  else if (!user.expires_in || user.expires_in < MIN_EXPIRY_FOR_PRE_SIGNIN) {
    // Intentionally not awaited. We don't want to delay the current request.
    fetchNewToken()
  }

  return user.access_token
}

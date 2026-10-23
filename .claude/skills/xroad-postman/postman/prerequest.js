// Collection-level pre-request script.
// Mirrors withAuth / withAutoAuth from libs/clients/middlewares so requests are
// authenticated the same way the island.is clients authenticate.
//
// The user logs in with the OAuth 2.0 (PKCE) auth on the collection. That
// token is only used as the subject token: every request's auth is replaced
// (bearer or noauth) so Postman never sends the user token itself.
//
// auth_mode:
//   none          - no Authorization header
//   forward       - send the user token as-is (like withAuth)
//   token         - client credentials token (autoAuth mode 'token')
//   tokenExchange - always token exchange, fails without a user token
//   auto          - token exchange if there is a user token, otherwise client credentials
;(() => {
  const TOKEN_EXCHANGE_GRANT = 'urn:ietf:params:oauth:grant-type:token-exchange'
  const ACCESS_TOKEN_TYPE = 'urn:ietf:params:oauth:token-type:access_token'
  const ACTOR_ACCESS_TOKEN_TYPE = 'islandis:oauth:token-type:actor-access-token'
  const METASERVICES = [
    'listClients',
    'listMethods',
    'allowedMethods',
    'getOpenAPI',
  ]
  // Per-request overrides, set by the generator when scopes or auth mode differ
  // per API. Removed before the request is sent.
  const SCOPE_OVERRIDE_HEADER = 'x-postman-auth-scope'
  const MODE_OVERRIDE_HEADER = 'x-postman-auth-mode'

  const v = (key) => pm.variables.get(key)
  const flag = (key) => String(v(key)).toLowerCase() === 'true'

  pm.collectionVariables.unset('_auth_error')

  const scopeOverride = pm.request.headers.get(SCOPE_OVERRIDE_HEADER)
  pm.request.headers.remove(SCOPE_OVERRIDE_HEADER)
  const modeOverride = pm.request.headers.get(MODE_OVERRIDE_HEADER)
  pm.request.headers.remove(MODE_OVERRIDE_HEADER)

  // The Postman app exposes the inherited collection auth on pm.request.auth,
  // but the open-source runtime (e.g. newman) does not, so subject_token is
  // kept as a fallback.
  const requestAuth = pm.request.auth
  const seenAuthType = requestAuth ? requestAuth.type : 'undefined'
  const authParams =
    requestAuth && requestAuth.type === 'oauth2' && requestAuth.parameters()
  const fromAuth = (authParams && authParams.get('accessToken')) || ''
  const fromVariable = v('subject_token') || ''
  const tokenSource = fromAuth
    ? 'oauth2 accessToken on pm.request.auth'
    : fromVariable
    ? 'subject_token variable'
    : 'none'

  // Never log token values here, only where they came from.
  const logAuth = (switchedTo) =>
    console.log(
      `auth: pm.request.auth type=${seenAuthType}, user token=${tokenSource}, switched to ${switchedTo}`,
    )
  const useNoAuth = (reason) => {
    pm.request.authorizeUsing('noauth')
    logAuth(`noauth (${reason})`)
  }

  // Auth set on a request or folder, i.e. anything other than the collection's
  // IDS login, is left alone. This lets users try out a provider's own auth on
  // the Authorization tab. The login is recognised by its token name or by an
  // auth URL on the IDS issuer, so renaming the token can't make the script
  // send the user token unexchanged.
  const issuer = pm.variables.replaceIn('{{ids_issuer}}')
  const isCollectionLogin =
    !!authParams &&
    (authParams.get('tokenName') === 'ids-user-token' ||
      pm.variables
        .replaceIn(String(authParams.get('authUrl') || ''))
        .startsWith(issuer))
  if (requestAuth && !isCollectionLogin) {
    return console.log(
      `auth: using the request's own auth (type=${seenAuthType})`,
    )
  }

  // Only X-Road service calls get auth: metaservices and non-X-Road calls are
  // sent without any auth.
  const url = pm.request.url.toString()
  const lastSegment = pm.request.url.path.filter(Boolean).slice(-1)[0]
  const mode = modeOverride || v('auth_mode') || 'none'
  if (mode === 'none') {
    return useNoAuth('auth_mode none')
  }
  if (!url.includes('/r1/') || METASERVICES.includes(lastSegment)) {
    return useNoAuth('not an X-Road service call')
  }

  const headerName = v('auth_header_name') || 'authorization'
  const setAuthorization = (authorization) => {
    if (headerName.toLowerCase() === 'authorization') {
      pm.request.authorizeUsing('bearer', {
        token: authorization.replace(/^bearer /i, ''),
      })
      return logAuth('bearer')
    }
    pm.request.authorizeUsing('noauth')
    pm.request.headers.upsert({ key: headerName, value: authorization })
    logAuth(`noauth + ${headerName} header`)
  }
  // Also drops the inherited auth, so a failed exchange never falls back to
  // sending the user token.
  const fail = (message) => {
    pm.collectionVariables.set('_auth_error', message)
    console.error(message)
    useNoAuth('auth failed')
  }

  const subjectToken = (fromAuth || fromVariable).replace(/^bearer /i, '')
  const scopes = (scopeOverride || v('auth_scope') || '')
    .split(/\s+/)
    .filter(Boolean)
  const noUserToken =
    'no user token. Log in on the collection Authorization tab (Get New Access Token, Use Token), or set subject_token.'

  if (mode === 'forward') {
    if (!subjectToken) {
      return fail(`auth_mode is "forward" but there is ${noUserToken}`)
    }
    return setAuthorization(`Bearer ${subjectToken}`)
  }

  if (mode === 'tokenExchange' && !subjectToken) {
    return fail(`auth_mode is "tokenExchange" but there is ${noUserToken}`)
  }
  const isTokenExchange = !!subjectToken && mode !== 'token'

  const decodeJwtPayload = (token) => {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4)
      return JSON.parse(
        CryptoJS.enc.Base64.parse(padded).toString(CryptoJS.enc.Utf8),
      )
    } catch (e) {
      return {}
    }
  }

  // Same shortcut as withAutoAuth: skip the exchange when the user token
  // already has every scope we need.
  if (isTokenExchange) {
    const claims = decodeJwtPayload(subjectToken)
    const tokenScopes = Array.isArray(claims.scope)
      ? claims.scope
      : String(claims.scope || '').split(' ')
    const hasAllScopes = scopes.every((scope) => tokenScopes.includes(scope))
    if (
      hasAllScopes &&
      !flag('always_token_exchange') &&
      (!flag('request_actor_token') || !claims.actor)
    ) {
      return setAuthorization(`Bearer ${subjectToken}`)
    }
  }

  // withAutoAuth only caches client credential tokens by default. Exchanged
  // tokens are cached here as well (keyed on the subject token) to avoid a
  // token request on every click.
  const cacheKey = [
    mode,
    isTokenExchange ? subjectToken.slice(-32) : 'client',
    scopes.join(' '),
    flag('request_actor_token'),
  ].join('|')
  const cached = JSON.parse(pm.collectionVariables.get('_auth_cache') || '{}')
  if (cached.key === cacheKey && cached.expiresAt > Date.now() + 30000) {
    return setAuthorization(cached.authorization)
  }

  const params = {
    grant_type: 'client_credentials',
    client_id: v('ids_client_id'),
    client_secret: v('ids_client_secret'),
    scope: scopes.join(' '),
  }
  if (v('auth_audience')) {
    params.audience = v('auth_audience')
  }
  if (isTokenExchange) {
    params.grant_type = TOKEN_EXCHANGE_GRANT
    params.subject_token = subjectToken
    params.subject_token_type = ACCESS_TOKEN_TYPE
    params.requested_token_type = flag('request_actor_token')
      ? ACTOR_ACCESS_TOKEN_TYPE
      : ACCESS_TOKEN_TYPE
  }
  if (!params.client_secret) {
    return fail(
      `ids_client_secret is empty. Copy it from the parameter store (${v(
        'ids_client_secret_ssm',
      )}) into the shared environment, see the collection description.`,
    )
  }

  const extraHeaders = JSON.parse(v('token_request_headers') || '{}')
  const tokenEndpoint =
    v('token_endpoint') || `${v('ids_issuer')}/connect/token`

  pm.sendRequest(
    {
      url: tokenEndpoint,
      method: 'POST',
      header: [
        ...Object.entries(extraHeaders).map(([key, value]) => ({
          key,
          value: pm.variables.replaceIn(String(value)),
        })),
        { key: 'Content-Type', value: 'application/x-www-form-urlencoded' },
      ],
      body: {
        mode: 'urlencoded',
        urlencoded: Object.entries(params).map(([key, value]) => ({
          key,
          value,
        })),
      },
    },
    (err, res) => {
      if (err) {
        return fail(
          `Token request to ${tokenEndpoint} failed: ${err.message || err}`,
        )
      }
      let result
      try {
        result = res.json()
      } catch (e) {
        return fail(
          `Token request returned ${
            res.code
          } with a non-JSON body: ${res.text()}`,
        )
      }
      if (res.code !== 200 || result.token_type !== 'Bearer') {
        return fail(
          `Token request returned ${res.code}: ${JSON.stringify(result)}`,
        )
      }
      if (
        isTokenExchange &&
        ![ACCESS_TOKEN_TYPE, ACTOR_ACCESS_TOKEN_TYPE].includes(
          result.issued_token_type,
        )
      ) {
        return fail(
          `Token exchange returned an invalid issued_token_type (${result.issued_token_type})`,
        )
      }

      const authorization = `Bearer ${result.access_token}`
      pm.collectionVariables.set(
        '_auth_cache',
        JSON.stringify({
          key: cacheKey,
          authorization,
          expiresAt: Date.now() + result.expires_in * 1000,
        }),
      )
      setAuthorization(authorization)
    },
  )
})()

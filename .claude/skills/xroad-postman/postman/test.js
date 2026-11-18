// Collection-level test script: turns token and X-Road errors into a readable
// diagnosis in the Test Results tab and the Postman console.
;(() => {
  const v = (key) => pm.variables.get(key)
  // Every token is requested by the IDS client in ids_client_id, so a token can
  // only carry scopes that client is allowed to request.
  const scopeHelp = () =>
    'The endpoint owner decides which scope is required, so ask them rather than guessing. ' +
    `Developers add scopes to the IDS client (${v(
      'ids_client_id',
    )}) in Stjórnborð → Innskráningarkerfi ` +
    '(https://beta.dev01.devland.is/stjornbord/innskraningarkerfi). After changing scopes, clear the _auth_cache collection variable.'

  const HINTS = [
    {
      match: /Shared params for instance identifier (\S+) not found/,
      title: (m) => `Security server does not know instance ${m[1]}`,
      advice: () =>
        `The security server at ${v(
          'xroad_base',
        )} belongs to another X-Road instance. ` +
        'Use the same instance as the security server (port-forwarded dev server: IS-DEV) in both the URL ' +
        'and the X-Road-Client header, or point xroad_base at a security server in the right instance.',
    },
    {
      match: /Could not find addresses for service provider/,
      title: () => 'Service provider is not registered in this instance',
      advice: () =>
        'Run "Diagnostics / listClients" and look for the provider member and subsystem. If they are missing, ' +
        'the provider has to register the subsystem in this instance, or you have to test in an instance where it exists.',
    },
    {
      match: /Client .*not found/i,
      title: () => 'X-Road-Client is not known to this security server',
      advice: () =>
        `Check that ${v(
          'xroad_client',
        )} is a client registered on the security server at ${v(
          'xroad_base',
        )}.`,
    },
    {
      match: /AccessDenied|access denied/i,
      title: () => 'Client has no access rights on the service',
      advice: () =>
        `The provider has to grant ${v('xroad_client')} access to ${v(
          'service_path',
        )}. ` +
        'Run "Diagnostics / allowedMethods" to see what you are allowed to call.',
    },
    {
      match: /UnknownService|unknown service/i,
      title: () => 'Service code not published by the provider',
      advice: () =>
        `Check service_code (${v(
          'service_code',
        )}) against "Diagnostics / listMethods".`,
    },
    {
      match: /ServiceFailed|NetworkError|Connection refused|timed out/i,
      title: () => 'Provider side failed',
      advice: () =>
        'X-Road could not reach or got an error from the provider security server or its backend. ' +
        'Usually needs to be checked by the provider.',
    },
    {
      match: /invalid_client/,
      title: () => 'IDS rejected the client credentials',
      advice: () => 'Check ids_client_id and ids_client_secret.',
    },
    {
      match: /invalid_scope/,
      title: () => 'IDS client is not allowed one of the requested scopes',
      advice: () => `Requested scopes: ${v('auth_scope')}. ${scopeHelp()}`,
    },
    {
      match: /invalid_grant/,
      title: () => 'Subject token rejected',
      advice: () =>
        'The user token has probably expired. Log in again on the collection Authorization tab (Get New Access Token, Use Token).',
    },
  ]

  const report = (text, fallbackTitle, fallbackAdvice) => {
    for (const hint of HINTS) {
      const m = text.match(hint.match)
      if (m) {
        const title = hint.title(m)
        const advice = hint.advice(m)
        console.warn(`Diagnosis: ${title}\n${advice}`)
        pm.test(`Diagnosis: ${title}`, () => {
          throw new Error(advice)
        })
        return
      }
    }
    const prefix = fallbackAdvice ? `${fallbackAdvice}\nResponse: ` : ''
    console.warn(`${fallbackTitle}\n${prefix}${text}`)
    pm.test(fallbackTitle, () => {
      throw new Error(`${prefix}${text.slice(0, 500)}`)
    })
  }

  const warn = (title, advice) => {
    console.warn(`${title}\n${advice}`)
    pm.test(title, () => {
      throw new Error(advice)
    })
  }
  const resolve = (value) => pm.variables.replaceIn(String(value ?? ''))
  // Must match headerVariable in generate.mjs.
  const headerVariable = (headerName) =>
    `header_${headerName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`

  const authError = pm.collectionVariables.get('_auth_error')
  if (authError) {
    pm.collectionVariables.unset('_auth_error')
    report(authError, 'Getting a token failed')
  }

  const enabledHeaders = pm.request.headers.all().filter((h) => !h.disabled)
  const missingHeaders = enabledHeaders.filter((h) => {
    const value = resolve(h.value)
    return value === '' || /\{\{.+\}\}/.test(value)
  })
  if (missingHeaders.length) {
    warn(
      `Header(s) without a value: ${missingHeaders
        .map((h) => h.key)
        .join(', ')}`,
      'Set them on the collection Variables tab: ' +
        missingHeaders
          .map((h) => `${headerVariable(h.key)} (${h.key})`)
          .join(', ') +
        ". Ask the provider for the values if you don't know them.",
    )
  }

  if (pm.response.code < 400) {
    return
  }

  // Values the generator fills in when the spec has no example. A failing
  // request that still uses one probably needs a real value.
  const PLACEHOLDERS = [
    'string',
    '00000000-0000-0000-0000-000000000000',
    '2026-01-01',
    '2026-01-01T00:00:00Z',
  ]
  const placeholders = [
    ...pm.request.url.variables
      .all()
      .map((p) => ['path variable', p.key, p.value]),
    ...pm.request.url.query
      .all()
      .filter((q) => !q.disabled)
      .map((q) => ['query parameter', q.key, q.value]),
    ...enabledHeaders.map((h) => ['header', h.key, h.value]),
  ].filter(([, , value]) => PLACEHOLDERS.includes(resolve(value)))
  if (placeholders.length) {
    warn(
      `Possibly wrong value(s): ${placeholders
        .map(([, key]) => key)
        .join(', ')}`,
      placeholders
        .map(
          ([kind, key, value]) =>
            `${kind} ${key} is still the generated placeholder "${resolve(
              value,
            )}"`,
        )
        .join('; ') + '. The service may reject it. Fill in a real value.',
    )
  }
  const xroadError = pm.response.headers.get('X-Road-Error')
  const text = `${
    xroadError ? `X-Road-Error: ${xroadError}\n` : ''
  }${pm.response.text()}`
  if (!xroadError && pm.response.code === 401) {
    return report(
      text,
      'Service returned 401 - the token was missing or not accepted',
      'Possible causes: ' +
        '(1) No token was sent. The "auth:" line in the Postman console shows what the request used; ' +
        'auth_mode none or a failed token request sends no token. ' +
        '(2) The token has expired. Log in again on the collection Authorization tab and clear the _auth_cache collection variable. ' +
        '(3) Wrong audience or issuer. Check auth_audience, and whether the provider trusts a different IDS environment. ' +
        '(4) The provider expects the token in another header (auth_header_name) or uses its own auth, e.g. an API key ' +
        "or basic auth. Ask the provider, and set it on the request's Authorization tab (request-level auth is left alone). " +
        `(5) The token is missing a scope; some services answer 401 instead of 403. ${scopeHelp()}`,
    )
  }
  if (!xroadError && pm.response.code === 403) {
    return report(
      text,
      "Service returned 403 - the token was accepted but doesn't grant access",
      `Usually the token is missing the scope the endpoint requires. ${scopeHelp()} ` +
        'Otherwise the logged-in user (or the delegation they act on) has no rights to the requested data.',
    )
  }
  report(text, `Request failed with ${pm.response.code}`)
})()

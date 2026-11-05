#!/usr/bin/env node
// Generates a Postman v2.1 collection for an X-Road service, plus the shared
// environment all generated collections use.
//
// Usage: node generate.mjs <config.json>
// Writes <slug>.postman_collection.json next to the config file, and
// ../_shared/xroad-dev.postman_environment.json and ../.gitignore if they don't
// exist yet. See SKILL.md for the config format.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const SKILL_DIR = path.dirname(fileURLToPath(import.meta.url))
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete']
const SCOPE_OVERRIDE_HEADER = 'x-postman-auth-scope'
const MODE_OVERRIDE_HEADER = 'x-postman-auth-mode'
const AUTH_MODES = ['none', 'forward', 'token', 'tokenExchange', 'auto']
// The shared environment holds everything that is the same for every
// collection: dev security server, X-Road client and IDS clients, matching how
// island.is services run locally against IDS dev. Secrets are empty and
// referenced by parameter store path only.
const SHARED_INSTANCE = 'IS-DEV'
const SHARED_ENVIRONMENT_NAME = `X-Road dev (${SHARED_INSTANCE})`
const SHARED_SECRET_SSM = {
  // Local default IdsClientConfig client. `yarn get-secrets` maps
  // IDENTITY_SERVER_CLIENT_SECRET to this parameter for every service.
  ids: '/k8s/local-dev/IDENTITY_SERVER_CLIENT_SECRET',
  // The My Pages BFF client; its local callback is registered in IDS dev.
  pkce: '/k8s/services-bff/portals-my-pages/IDENTITY_SERVER_CLIENT_SECRET',
}
const SHARED_VARIABLES = [
  ['xroad_base', 'http://localhost:8081'],
  ['xroad_client', `${SHARED_INSTANCE}/GOV/10000/island-is-client`],
  ['ids_issuer', 'https://identity-server.dev01.devland.is'],
  ['ids_client_id', '@island.is/clients/dev'],
  ['ids_client_secret', '', 'secret'],
  ['ids_client_secret_ssm', SHARED_SECRET_SSM.ids],
  ['pkce_client_id', '@island.is/web'],
  ['pkce_client_secret', '', 'secret'],
  ['pkce_client_secret_ssm', SHARED_SECRET_SSM.pkce],
  ['pkce_redirect_uri', 'http://localhost:3010/bff/callbacks/login'],
  ['pkce_scope', 'openid profile'],
  // Fallback only: the user token normally comes from the collection auth.
  ['subject_token', '', 'secret'],
]

const configPath = process.argv[2]
if (!configPath) {
  console.error('Usage: node generate.mjs <config.json>')
  process.exit(1)
}
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const outDir = path.dirname(path.resolve(configPath))

// Secrets are filled in by the user inside Postman, never written to disk by
// this generator.
const FORBIDDEN_KEYS = [
  'clientSecret',
  'client_secret',
  'subjectToken',
  'subject_token',
  'accessToken',
  'access_token',
]
const findForbidden = (obj, trail = []) =>
  Object.entries(obj ?? {}).flatMap(([key, value]) => [
    ...(FORBIDDEN_KEYS.includes(key) ? [[...trail, key].join('.')] : []),
    ...(value && typeof value === 'object'
      ? findForbidden(value, [...trail, key])
      : []),
  ])
// Header values end up in collection variables, which sync with the
// collection, so headers that carry credentials must be filled in by the user.
const SECRET_HEADER_NAME =
  /authorization|api[-_]?key|secret|token|password|subscription-key/i
const forbidden = [
  ...findForbidden(config),
  ...Object.keys(config.headers || {})
    .filter((headerName) => SECRET_HEADER_NAME.test(headerName))
    .map((headerName) => `headers.${headerName}`),
]
if (forbidden.length) {
  console.error(
    `Refusing to generate: config contains secret fields (${forbidden.join(
      ', ',
    )}). Remove them.`,
  )
  process.exit(1)
}

const { name, xroad, auth = { mode: 'none' } } = config
// X-Road service id: INSTANCE/CLASS/MEMBER/SUBSYSTEM/SERVICECODE
const serviceParts = xroad.servicePath.split('/')
if (serviceParts.length !== 5) {
  console.error(
    `xroad.servicePath must have 5 segments (INSTANCE/CLASS/MEMBER/SUBSYSTEM/SERVICECODE), got "${xroad.servicePath}"`,
  )
  process.exit(1)
}
const [instance, , memberCode, subsystemCode, serviceCode] = serviceParts
if (instance !== SHARED_INSTANCE) {
  console.error(
    `Only ${SHARED_INSTANCE} is supported (shared environment "${SHARED_ENVIRONMENT_NAME}"), got "${instance}".`,
  )
  process.exit(1)
}
// Values in the shared environment can't be overridden per collection:
// Postman environment variables take precedence over collection variables.
const sharedOverrides = [
  xroad.baseUrl && 'xroad.baseUrl',
  xroad.clientId && 'xroad.clientId',
  auth.issuer && 'auth.issuer',
  auth.clientId && 'auth.clientId',
  auth.clientSecretSsm && 'auth.clientSecretSsm',
  auth.pkce && 'auth.pkce',
].filter(Boolean)
if (sharedOverrides.length) {
  console.error(
    `${sharedOverrides.join(
      ', ',
    )} come from the shared environment and can't be set per collection. Remove them from the config.`,
  )
  process.exit(1)
}
const allModes = [auth.mode, ...Object.values(auth.modeByTag || {})]
const invalidModes = allModes.filter((m) => !AUTH_MODES.includes(m))
if (invalidModes.length) {
  console.error(
    `Unknown auth mode(s): ${invalidModes.join(
      ', ',
    )}. Use one of ${AUTH_MODES.join(', ')}.`,
  )
  process.exit(1)
}
const usesUserToken = allModes.some((m) =>
  ['forward', 'tokenExchange', 'auto'].includes(m),
)

const readScript = (file) =>
  fs.readFileSync(path.join(SKILL_DIR, 'postman', file), 'utf8').split('\n')

const loadOpenApi = (file) => {
  const text = fs.readFileSync(
    path.resolve(path.dirname(configPath), file),
    'utf8',
  )
  if (/\.ya?ml$/i.test(file)) {
    // js-yaml is resolved from the current repo (island.is has it installed).
    const yaml = createRequire(path.join(process.cwd(), 'package.json'))(
      'js-yaml',
    )
    return yaml.load(text)
  }
  return JSON.parse(text)
}

const header = (key, value, extra = {}) => ({
  key,
  value,
  type: 'text',
  ...extra,
})
const xroadClientHeader = header('X-Road-Client', '{{xroad_client}}')
const acceptJson = header('Accept', 'application/json')

const buildUrl = (base, segments, query = [], variable = []) => ({
  raw:
    [base, ...segments].join('/') +
    (query.length
      ? `?${query.map((q) => `${q.key}=${q.value}`).join('&')}`
      : ''),
  host: [base],
  path: segments,
  ...(query.length && { query }),
  ...(variable.length && { variable }),
})

const metaserviceRequest = (
  title,
  segments,
  { query = [], headers = [acceptJson, xroadClientHeader], tests, description },
) => ({
  name: title,
  ...(tests && {
    event: [
      { listen: 'test', script: { type: 'text/javascript', exec: tests } },
    ],
  }),
  request: {
    method: 'GET',
    auth: { type: 'noauth' },
    header: headers,
    url: buildUrl('{{xroad_base}}', segments, query),
    description,
  },
})

const LIST_CLIENTS_TESTS = [
  '// Look for the provider in the instance the security server belongs to.',
  "const memberCode = pm.variables.get('provider_member_code')",
  "const subsystemCode = pm.variables.get('provider_subsystem_code')",
  'let members = []',
  'try {',
  '  members = pm.response.json().member || []',
  '} catch (e) {',
  "  console.warn('listClients did not return JSON. Check the raw response.')",
  '}',
  'const matches = members.filter((m) => m.id && m.id.member_code === memberCode)',
  "console.log('Provider entries:', JSON.stringify(matches, null, 2))",
  'pm.test(`Provider member ${memberCode} is registered in this instance`, () => {',
  '  pm.expect(matches.length).to.be.above(0)',
  '})',
  'pm.test(`Provider subsystem ${subsystemCode} is registered`, () => {',
  '  pm.expect(matches.some((m) => m.id.subsystem_code === subsystemCode)).to.equal(true)',
  '})',
]

const diagnosticsFolder = {
  name: 'Diagnostics',
  description: 'X-Road metaservices. Run these when a service call fails.',
  item: [
    metaserviceRequest('listClients', ['listClients'], {
      headers: [acceptJson],
      query: [
        { key: 'xRoadInstance', value: '{{xroad_instance}}', disabled: true },
      ],
      tests: LIST_CLIENTS_TESTS,
      description:
        'All members/subsystems known in the instance of this security server.',
    }),
    metaserviceRequest(
      'listMethods',
      ['r1', '{{provider_subsystem}}', 'listMethods'],
      {
        description: 'Services the provider subsystem publishes.',
      },
    ),
    metaserviceRequest(
      'allowedMethods',
      ['r1', '{{provider_subsystem}}', 'allowedMethods'],
      {
        description:
          'Services on the provider subsystem that X-Road-Client is allowed to call.',
      },
    ),
    metaserviceRequest(
      'getOpenAPI',
      ['r1', '{{provider_subsystem}}', 'getOpenAPI'],
      {
        query: [{ key: 'serviceCode', value: '{{service_code}}' }],
        description:
          'OpenAPI description of the service, if the provider has uploaded one.',
      },
    ),
  ],
}

// User login on the collection's Authorization tab, inherited by the service
// requests. The pre-request script only uses this token as the subject token
// and replaces each request's auth, so it is never sent to a service itself.
const collectionAuth = {
  type: 'oauth2',
  oauth2: [
    {
      key: 'grant_type',
      value: 'authorization_code_with_pkce',
      type: 'string',
    },
    {
      key: 'authUrl',
      value: '{{ids_issuer}}/connect/authorize',
      type: 'string',
    },
    {
      key: 'accessTokenUrl',
      value: '{{ids_issuer}}/connect/token',
      type: 'string',
    },
    { key: 'clientId', value: '{{pkce_client_id}}', type: 'string' },
    { key: 'clientSecret', value: '{{pkce_client_secret}}', type: 'string' },
    { key: 'scope', value: '{{pkce_scope}}', type: 'string' },
    // Postman's built-in auth window intercepts the redirect, so nothing has
    // to listen on this URI; it only has to be registered on the IDS client.
    { key: 'redirect_uri', value: '{{pkce_redirect_uri}}', type: 'string' },
    { key: 'useBrowser', value: false, type: 'boolean' },
    { key: 'challengeAlgorithm', value: 'S256', type: 'string' },
    { key: 'client_authentication', value: 'body', type: 'string' },
    { key: 'addTokenTo', value: 'header', type: 'string' },
    { key: 'tokenName', value: 'ids-user-token', type: 'string' },
  ],
}

// --- Headers ----------------------------------------------------------------

// Set by this collection itself; header parameters with these names in the
// spec are ignored.
const RESERVED_HEADERS = [
  'x-road-client',
  'authorization',
  'accept',
  'content-type',
]
// Header name → { example, description }. Each header gets one collection
// variable, so the user sets its value once for all requests.
const headerParams = new Map()
// Must match headerVariable in postman/test.js.
const headerVariable = (headerName) =>
  `header_${headerName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
const registerHeader = (headerName, info = {}) => {
  if (!headerParams.has(headerName)) headerParams.set(headerName, info)
}

// --- Spec auth --------------------------------------------------------------

// Lists the auth the spec declares that this collection can't provide, i.e.
// anything other than the island.is identity server.
const ISLAND_IS_IDS =
  /identity-server\.[a-z0-9]+\.devland\.is|innskra\.island\.is/
const describeForeignAuth = (spec) => {
  const schemes =
    spec.components?.securitySchemes || spec.securityDefinitions || {}
  return Object.entries(schemes).flatMap(([schemeName, scheme]) => {
    const urls = [
      scheme.openIdConnectUrl,
      scheme.authorizationUrl,
      scheme.tokenUrl,
      ...Object.values(scheme.flows || {}).flatMap((flow) => [
        flow.authorizationUrl,
        flow.tokenUrl,
      ]),
    ].filter(Boolean)
    const label =
      schemeName === scheme.type
        ? scheme.type
        : `${scheme.type} (${schemeName})`
    if (scheme.type === 'apiKey') {
      return [`${label}: key in ${scheme.in} "${scheme.name}"`]
    }
    if (scheme.type === 'http') {
      return [`${label}: HTTP ${scheme.scheme} auth`]
    }
    const foreignUrls = urls.filter((url) => !ISLAND_IS_IDS.test(url))
    return foreignUrls.length
      ? [`${label} against ${[...new Set(foreignUrls)].join(', ')}`]
      : []
  })
}

// --- OpenAPI → requests ---------------------------------------------------

// Path and query parameter values by name, e.g. { "municipalityCode": "0000" }.
const knownValues = config.values || {}
const usedValues = new Set()

const buildServiceItems = (spec) => {
  const resolve = (node, seen = new Set()) => {
    if (!node || !node.$ref) return node
    if (seen.has(node.$ref)) return {}
    seen.add(node.$ref)
    const target = node.$ref
      .replace(/^#\//, '')
      .split('/')
      .map((p) => p.replace(/~1/g, '/').replace(/~0/g, '~'))
      .reduce((acc, key) => acc?.[key], spec)
    return resolve(target, seen)
  }

  const exampleFor = (schemaNode, depth = 0) => {
    const schema = resolve(schemaNode)
    if (!schema || depth > 6) return null
    if (schema.example !== undefined) return schema.example
    if (schema.default !== undefined) return schema.default
    if (schema.allOf)
      return Object.assign(
        {},
        ...schema.allOf.map((s) => exampleFor(s, depth + 1)),
      )
    if (schema.oneOf || schema.anyOf)
      return exampleFor((schema.oneOf || schema.anyOf)[0], depth + 1)
    if (schema.enum) return schema.enum[0]
    const type = Array.isArray(schema.type)
      ? schema.type.find((t) => t !== 'null')
      : schema.type
    if (type === 'array') return [exampleFor(schema.items, depth + 1)]
    if (type === 'object' || schema.properties) {
      return Object.fromEntries(
        Object.entries(schema.properties || {}).map(([key, prop]) => [
          key,
          exampleFor(prop, depth + 1),
        ]),
      )
    }
    if (type === 'integer' || type === 'number') return 0
    if (type === 'boolean') return false
    if (schema.format === 'date-time') return '2026-01-01T00:00:00Z'
    if (schema.format === 'date') return '2026-01-01'
    if (schema.format === 'uuid') return '00000000-0000-0000-0000-000000000000'
    return 'string'
  }

  const stripPrefix = config.openapiStripPrefix || ''
  const scopesByTag = config.auth?.scopesByTag || {}
  const modeByTag = config.auth?.modeByTag || {}
  const folders = new Map()

  for (const [rawPath, pathItem] of Object.entries(spec.paths || {})) {
    for (const method of HTTP_METHODS) {
      const op = pathItem[method]
      if (!op) continue
      const params = [
        ...(pathItem.parameters || []),
        ...(op.parameters || []),
      ].map((p) => resolve(p))
      const opPath = rawPath.startsWith(stripPrefix)
        ? rawPath.slice(stripPrefix.length)
        : rawPath
      const segments = opPath
        .split('/')
        .filter(Boolean)
        .map((s) => s.replace(/^\{(.+)\}$/, ':$1'))

      // Known values (config.values, e.g. from a working example call) win over
      // generated examples, and enable optional query parameters.
      const valueFor = (p) => {
        if (p.name in knownValues) {
          usedValues.add(p.name)
          return String(knownValues[p.name])
        }
        return String(p.example ?? exampleFor(p.schema ?? p) ?? '')
      }
      const query = params
        .filter((p) => p.in === 'query')
        .map((p) => ({
          key: p.name,
          value: valueFor(p),
          disabled: !p.required && !(p.name in knownValues),
          description: p.description,
        }))
      const variable = params
        .filter((p) => p.in === 'path')
        .map((p) => ({
          key: p.name,
          value: valueFor(p),
          description: p.description,
        }))
      // Optional headers are added but disabled.
      const headerItems = params
        .filter(
          (p) =>
            p.in === 'header' &&
            !RESERVED_HEADERS.includes(p.name.toLowerCase()),
        )
        .map((p) => {
          registerHeader(p.name, {
            example: p.example ?? p.schema?.example,
            description: p.description,
          })
          return header(p.name, `{{${headerVariable(p.name)}}}`, {
            disabled: !p.required,
            description: p.description,
          })
        })

      // OpenAPI 3 requestBody, or Swagger 2 "in: body" parameter. Specs often
      // use variants like "application/json; x-api-version=1.0", so match any
      // JSON media type and prefer application/json*.
      const content = resolve(op.requestBody)?.content || {}
      const jsonMediaType =
        Object.keys(content).find((t) => t.startsWith('application/json')) ??
        Object.keys(content).find((t) => t.includes('json'))
      const bodySchema = jsonMediaType
        ? content[jsonMediaType].schema
        : params.find((p) => p.in === 'body')?.schema
      const tag = op.tags?.[0] || 'Service'
      const tagScopes = scopesByTag[tag]

      const headers = [acceptJson, xroadClientHeader, ...headerItems]
      if (bodySchema)
        headers.push(
          header('Content-Type', jsonMediaType || 'application/json'),
        )
      if (tagScopes)
        headers.push(
          header(SCOPE_OVERRIDE_HEADER, tagScopes.join(' '), {
            description:
              'Scopes for this API. Removed before the request is sent.',
          }),
        )
      if (modeByTag[tag])
        headers.push(
          header(MODE_OVERRIDE_HEADER, modeByTag[tag], {
            description:
              'Auth mode for this API. Removed before the request is sent.',
          }),
        )

      const item = {
        name:
          op.summary || op.operationId || `${method.toUpperCase()} ${rawPath}`,
        request: {
          method: method.toUpperCase(),
          header: headers,
          url: buildUrl(
            '{{xroad_base}}',
            ['r1', '{{service_path}}', ...segments],
            query,
            variable,
          ),
          description: op.description,
          ...(bodySchema && {
            body: {
              mode: 'raw',
              raw: JSON.stringify(exampleFor(bodySchema), null, 2),
              options: { raw: { language: 'json' } },
            },
          }),
        },
      }
      if (!folders.has(tag)) folders.set(tag, [])
      folders.get(tag).push(item)
    }
  }

  return [...folders.entries()].map(([tag, item]) => ({ name: tag, item }))
}

const buildManualItems = (requests) =>
  requests.map((r) => ({
    name: r.name || `${r.method || 'GET'} ${r.path}`,
    request: {
      method: (r.method || 'GET').toUpperCase(),
      header: [
        acceptJson,
        xroadClientHeader,
        ...(r.body ? [header('Content-Type', 'application/json')] : []),
      ],
      url: buildUrl(
        '{{xroad_base}}',
        ['r1', '{{service_path}}', ...r.path.split('/').filter(Boolean)],
        Object.entries(r.query || {}).map(([key, value]) => ({
          key,
          value: String(value),
        })),
      ),
      ...(r.body && {
        body: {
          mode: 'raw',
          raw: JSON.stringify(r.body, null, 2),
          options: { raw: { language: 'json' } },
        },
      }),
    },
  }))

const spec = config.openapi ? loadOpenApi(config.openapi) : null
const serviceItems = spec
  ? buildServiceItems(spec)
  : buildManualItems(
      config.requests?.length ? config.requests : [{ path: '/' }],
    )
const foreignAuth = spec ? describeForeignAuth(spec) : []

// Headers from the config that the spec doesn't declare (or all of them, for
// manual requests) are added, enabled, to every service request.
const extraHeaders = Object.keys(config.headers || {}).filter(
  (headerName) => !headerParams.has(headerName),
)
extraHeaders.forEach((headerName) => registerHeader(headerName))
const serviceRequests = serviceItems.flatMap((i) => (i.item ? i.item : [i]))
for (const { request } of serviceRequests) {
  request.header.push(
    ...extraHeaders.map((headerName) =>
      header(headerName, `{{${headerVariable(headerName)}}}`),
    ),
  )
}

// --- Output -----------------------------------------------------------------

const collectionVariables = [
  ['xroad_instance', instance],
  ['service_path', xroad.servicePath],
  ['provider_subsystem', serviceParts.slice(0, 4).join('/')],
  ['provider_member_code', memberCode],
  ['provider_subsystem_code', subsystemCode],
  ['service_code', serviceCode],
  ['auth_mode', auth.mode],
  ['auth_scope', (auth.scope || []).join(' ')],
  ['auth_audience', auth.audience],
  ['auth_header_name', auth.headerName || 'authorization'],
  ['token_endpoint', auth.tokenEndpoint],
  [
    'token_request_headers',
    auth.tokenRequestHeaders ? JSON.stringify(auth.tokenRequestHeaders) : '',
  ],
  ['always_token_exchange', String(!!auth.alwaysTokenExchange)],
  ['request_actor_token', String(!!auth.requestActorToken)],
  ['_auth_cache', ''],
  ['_auth_error', ''],
  ...[...headerParams].map(([headerName, info]) => [
    headerVariable(headerName),
    config.headers?.[headerName] ?? info.example ?? '',
  ]),
]
// An environment variable with the same name would silently win.
const sharedKeys = new Set(SHARED_VARIABLES.map(([key]) => key))
const clashes = collectionVariables
  .map(([key]) => key)
  .filter((key) => sharedKeys.has(key))
if (clashes.length) {
  throw new Error(
    `Collection variables clash with the shared environment: ${clashes.join(
      ', ',
    )}`,
  )
}

const ssmCommand = (ssmPath, variable) =>
  `    aws ssm get-parameter --name ${ssmPath} --with-decryption --query Parameter.Value --output text | pbcopy   # → ${variable}`

const collection = {
  info: {
    name: `X-Road: ${name}`,
    schema:
      'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    description: [
      `Service ${xroad.servicePath}. Use with the shared environment "${SHARED_ENVIRONMENT_NAME}".`,
      'Auth is handled by the collection pre-request script (mirrors enhancedFetch autoAuth); ' +
        'X-Road errors are explained in the Test Results tab.',
      ...(usesUserToken
        ? [
            '',
            'Log in on the collection Authorization tab: Get New Access Token → log in → Use Token.',
          ]
        : []),
      ...(headerParams.size
        ? [
            '',
            'Header values are collection variables (Variables tab), shared by all requests: ' +
              [...headerParams.keys()]
                .map((h) => `${h} → ${headerVariable(h)}`)
                .join(', ') +
              '.',
          ]
        : []),
      ...(foreignAuth.length
        ? [
            '',
            'The spec declares auth this collection does not provide (only the island.is identity server is supported). ' +
              'Ask the provider whether it applies to calls over X-Road:',
            ...foreignAuth.map((note) => `    ${note}`),
          ]
        : []),
      '',
      'Secrets are only stored in the shared environment. Copy them from the parameter store (AWS SSO login to the dev account) ' +
        'and paste them into the matching secret variable:',
      '',
      ssmCommand(SHARED_SECRET_SSM.ids, 'ids_client_secret'),
      ...(usesUserToken
        ? [ssmCommand(SHARED_SECRET_SSM.pkce, 'pkce_client_secret')]
        : []),
    ].join('\n'),
  },
  ...(usesUserToken && { auth: collectionAuth }),
  event: [
    {
      listen: 'prerequest',
      script: { type: 'text/javascript', exec: readScript('prerequest.js') },
    },
    {
      listen: 'test',
      script: { type: 'text/javascript', exec: readScript('test.js') },
    },
  ],
  variable: collectionVariables.map(([key, value]) => ({
    key,
    value: value ?? '',
  })),
  item: [diagnosticsFolder, { name: 'Service', item: serviceItems }],
}

const sharedEnvironment = {
  name: SHARED_ENVIRONMENT_NAME,
  values: SHARED_VARIABLES.map(([key, value, type = 'default']) => ({
    key,
    value,
    type,
    enabled: true,
  })),
  _postman_variable_scope: 'environment',
}

const ICELANDIC_LETTERS = { þ: 'th', ð: 'd', æ: 'ae' }
const slug = name
  .toLowerCase()
  .replace(/[þðæ]/g, (c) => ICELANDIC_LETTERS[c])
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
// The output root (the folder above each collection's folder) is inside the
// repo. A .gitignore that ignores everything, itself included, keeps it out of
// git on every machine.
const outputIgnoreFile = path.join(outDir, '..', '.gitignore')
if (!fs.existsSync(outputIgnoreFile)) fs.writeFileSync(outputIgnoreFile, '*\n')

const collectionFile = path.join(outDir, `${slug}.postman_collection.json`)
fs.writeFileSync(collectionFile, JSON.stringify(collection, null, 2))

// The shared environment is written once and never overwritten: the user's
// Postman copy holds the secrets. If the skill adds variables later, report
// them so the user can add them in Postman.
const sharedFile = path.join(
  outDir,
  '..',
  '_shared',
  'xroad-dev.postman_environment.json',
)
let sharedStatus
if (fs.existsSync(sharedFile)) {
  const existing = new Set(
    JSON.parse(fs.readFileSync(sharedFile, 'utf8')).values.map((v) => v.key),
  )
  const missing = [...sharedKeys].filter((key) => !existing.has(key))
  sharedStatus = missing.length
    ? `exists, but is missing: ${missing.join(
        ', ',
      )}. Add them in Postman (see SHARED_VARIABLES in generate.mjs).`
    : 'exists, unchanged'
} else {
  fs.mkdirSync(path.dirname(sharedFile), { recursive: true })
  fs.writeFileSync(sharedFile, JSON.stringify(sharedEnvironment, null, 2))
  sharedStatus = 'created'
}

console.log(`Collection:         ${collectionFile}`)
console.log(`Shared environment: ${path.resolve(sharedFile)} (${sharedStatus})`)
console.log(`Service requests:   ${serviceRequests.length}`)

const emptyRequiredHeaders = [...headerParams.keys()].filter((headerName) => {
  const value = collectionVariables.find(
    ([key]) => key === headerVariable(headerName),
  )[1]
  const isRequired = serviceRequests.some(({ request }) =>
    request.header.some((h) => h.key === headerName && !h.disabled),
  )
  return isRequired && !value
})
if (emptyRequiredHeaders.length) {
  console.log(
    `Required headers without a value: ${emptyRequiredHeaders
      .map((h) => `${h} (${headerVariable(h)})`)
      .join(', ')}`,
  )
}
const unusedValues = spec
  ? Object.keys(knownValues).filter((key) => !usedValues.has(key))
  : []
if (unusedValues.length) {
  console.log(
    `values not matching any path or query parameter in the spec: ${unusedValues.join(
      ', ',
    )}`,
  )
}
if (foreignAuth.length) {
  console.log(
    `Spec auth not supported by this collection:\n${foreignAuth
      .map((note) => `  ${note}`)
      .join('\n')}`,
  )
}

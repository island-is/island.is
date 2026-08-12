import type { EnvironmentVariableValue } from './types/input-types'

export const CONTENT_SECURITY_POLICY_ENV = 'CONTENT_SECURITY_POLICY'
export const CONTENT_SECURITY_POLICY_HASH_DIRECTIVES_ENV =
  'CONTENT_SECURITY_POLICY_HASH_DIRECTIVES'
export const CONTENT_SECURITY_POLICY_REPORT_ONLY_ENV =
  'CONTENT_SECURITY_POLICY_REPORT_ONLY'

export type ContentSecurityPolicyHashDirective = 'script-src' | 'style-src-elem'

export type ContentSecurityPolicySource = string

export type SandboxValue =
  | 'allow-downloads'
  | 'allow-forms'
  | 'allow-modals'
  | 'allow-orientation-lock'
  | 'allow-pointer-lock'
  | 'allow-popups'
  | 'allow-popups-to-escape-sandbox'
  | 'allow-presentation'
  | 'allow-same-origin'
  | 'allow-scripts'
  | 'allow-storage-access-by-user-activation'
  | 'allow-top-navigation'
  | 'allow-top-navigation-by-user-activation'
  | 'allow-top-navigation-to-custom-protocols'

/** A CSP Level 3 policy, expressed using camel-cased directive names. */
export type ContentSecurityPolicy = {
  // Fetch directives
  childSrc?: readonly ContentSecurityPolicySource[]
  connectSrc?: readonly ContentSecurityPolicySource[]
  defaultSrc?: readonly ContentSecurityPolicySource[]
  fontSrc?: readonly ContentSecurityPolicySource[]
  frameSrc?: readonly ContentSecurityPolicySource[]
  imgSrc?: readonly ContentSecurityPolicySource[]
  manifestSrc?: readonly ContentSecurityPolicySource[]
  mediaSrc?: readonly ContentSecurityPolicySource[]
  objectSrc?: readonly ContentSecurityPolicySource[]
  scriptSrc?: readonly ContentSecurityPolicySource[]
  scriptSrcAttr?: readonly ContentSecurityPolicySource[]
  scriptSrcElem?: readonly ContentSecurityPolicySource[]
  styleSrc?: readonly ContentSecurityPolicySource[]
  styleSrcAttr?: readonly ContentSecurityPolicySource[]
  styleSrcElem?: readonly ContentSecurityPolicySource[]
  workerSrc?: readonly ContentSecurityPolicySource[]

  // Document directives
  baseUri?: readonly ContentSecurityPolicySource[]
  pluginTypes?: readonly string[]
  sandbox?: true | readonly SandboxValue[]

  // Navigation directives
  formAction?: readonly ContentSecurityPolicySource[]
  frameAncestors?: readonly ContentSecurityPolicySource[]
  navigateTo?: readonly ContentSecurityPolicySource[]

  // Reporting directives
  reportTo?: readonly string[]
  reportUri?: readonly string[]

  // Mixed-content and Trusted Types directives
  blockAllMixedContent?: boolean
  upgradeInsecureRequests?: boolean
  requireTrustedTypesFor?: readonly ["'script'"]
  trustedTypes?: readonly string[]
}

export type Policy = ContentSecurityPolicy

export type EnvironmentContentSecurityPolicies = {
  dev: ContentSecurityPolicy
  staging: ContentSecurityPolicy
  prod: ContentSecurityPolicy
  local?: ContentSecurityPolicy
}

export type EnvironmentPolicies = EnvironmentContentSecurityPolicies

export type ContentSecurityPolicyConfig = {
  enforce?: ContentSecurityPolicy | EnvironmentContentSecurityPolicies
  reportOnly?: ContentSecurityPolicy | EnvironmentContentSecurityPolicies
  hashDirectives?: readonly ContentSecurityPolicyHashDirective[]
}

const allowedHashDirectives: readonly ContentSecurityPolicyHashDirective[] = [
  'script-src',
  'style-src-elem',
]

export const serializeContentSecurityPolicyHashDirectives = (
  directives: readonly ContentSecurityPolicyHashDirective[],
): string => {
  if (!Array.isArray(directives) || directives.length === 0) {
    throw new Error('CSP hash directives must be a non-empty array')
  }
  if (new Set(directives).size !== directives.length) {
    throw new Error('CSP hash directives must not contain duplicates')
  }
  for (const directive of directives) {
    if (!allowedHashDirectives.includes(directive)) {
      throw new Error(`Unsupported CSP hash directive: ${directive}`)
    }
  }
  return [...directives].sort().join(' ')
}

type DirectiveKind = 'sources' | 'sandbox' | 'flag'

const directiveKinds: Record<keyof ContentSecurityPolicy, DirectiveKind> = {
  baseUri: 'sources',
  blockAllMixedContent: 'flag',
  childSrc: 'sources',
  connectSrc: 'sources',
  defaultSrc: 'sources',
  fontSrc: 'sources',
  formAction: 'sources',
  frameAncestors: 'sources',
  imgSrc: 'sources',
  manifestSrc: 'sources',
  mediaSrc: 'sources',
  navigateTo: 'sources',
  objectSrc: 'sources',
  pluginTypes: 'sources',
  reportTo: 'sources',
  reportUri: 'sources',
  requireTrustedTypesFor: 'sources',
  sandbox: 'sandbox',
  scriptSrc: 'sources',
  scriptSrcAttr: 'sources',
  scriptSrcElem: 'sources',
  styleSrc: 'sources',
  styleSrcAttr: 'sources',
  styleSrcElem: 'sources',
  trustedTypes: 'sources',
  upgradeInsecureRequests: 'flag',
  workerSrc: 'sources',
  frameSrc: 'sources',
}

const toKebabCase = (value: string) =>
  value.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)

const quotedSourceExpression =
  /^'(?:self|none|unsafe-inline|unsafe-eval|unsafe-hashes|wasm-unsafe-eval|strict-dynamic|report-sample|inline-speculation-rules|unsafe-allow-redirects|allow-duplicates|script|nonce-[A-Za-z0-9+/_-]+={0,2}|sha(?:256|384|512)-[A-Za-z0-9+/_-]+={0,2})'$/u
const unquotedSourceExpression = /^[A-Za-z0-9*.:/?#%&=+_@!~,()[\]-]+$/u

const assertSafeToken = (directive: string, token: unknown): string => {
  if (typeof token !== 'string' || token.length === 0) {
    throw new Error(
      `CSP directive ${directive} contains an empty or non-string value`,
    )
  }

  // Values are substituted into a double-quoted nginx directive and separated by
  // spaces/semicolons in CSP syntax. Reject characters that could escape either.
  if (/\s|[;"\\$]/u.test(token) || /[\u0000-\u001f\u007f]/u.test(token)) {
    throw new Error(
      `CSP directive ${directive} contains an unsafe value: ${token}`,
    )
  }
  const isValidToken = token.startsWith("'")
    ? quotedSourceExpression.test(token)
    : unquotedSourceExpression.test(token)
  if (!isValidToken) {
    throw new Error(
      `CSP directive ${directive} contains an invalid value: ${token}`,
    )
  }

  return token
}

export const serializeContentSecurityPolicy = (
  policy: ContentSecurityPolicy,
): string => {
  if (policy === null || typeof policy !== 'object' || Array.isArray(policy)) {
    throw new Error('CSP policy must be a directive object')
  }

  return Object.entries(policy)
    .map(([directive, value]) => {
      const kind = directiveKinds[directive as keyof ContentSecurityPolicy]
      if (!kind) {
        throw new Error(`Unknown CSP directive: ${directive}`)
      }

      const serializedDirective = toKebabCase(directive)
      if (kind === 'flag') {
        if (typeof value !== 'boolean') {
          throw new Error(`CSP directive ${directive} must be a boolean`)
        }
        return value ? serializedDirective : undefined
      }

      if (kind === 'sandbox' && value === true) {
        return serializedDirective
      }
      if (!Array.isArray(value)) {
        throw new Error(`CSP directive ${directive} must be an array`)
      }
      if (value.length === 0) {
        if (kind === 'sandbox') return serializedDirective
        throw new Error(`CSP directive ${directive} must not be empty`)
      }

      const tokens = value.map((token) => assertSafeToken(directive, token))
      return `${serializedDirective} ${tokens.join(' ')}`
    })
    .filter((directive): directive is string => directive !== undefined)
    .sort()
    .join('; ')
}

const environmentNames = ['dev', 'staging', 'prod'] as const
const environmentPolicyKeys: readonly string[] = [...environmentNames, 'local']

const isEnvironmentPolicies = (
  policy: ContentSecurityPolicy | EnvironmentContentSecurityPolicies,
): policy is EnvironmentContentSecurityPolicies =>
  Object.keys(policy).some((key) => environmentPolicyKeys.includes(key))

const hashDirectiveKeys: Record<
  ContentSecurityPolicyHashDirective,
  keyof ContentSecurityPolicy
> = {
  'script-src': 'scriptSrc',
  'style-src-elem': 'styleSrcElem',
}

export const validateContentSecurityPolicyHashDirectives = (
  directives: readonly ContentSecurityPolicyHashDirective[],
  policies: Readonly<
    Partial<
      Record<
        'enforce' | 'reportOnly',
        ContentSecurityPolicy | EnvironmentContentSecurityPolicies
      >
    >
  >,
): void => {
  const configuredPolicies = Object.entries(policies).filter(
    (
      entry,
    ): entry is [
      'enforce' | 'reportOnly',
      ContentSecurityPolicy | EnvironmentContentSecurityPolicies,
    ] => entry[1] !== undefined,
  )

  if (configuredPolicies.length === 0) {
    throw new Error(
      'CSP hash directives require an enforcement or report-only policy',
    )
  }

  for (const [mode, policy] of configuredPolicies) {
    const policiesByEnvironment = isEnvironmentPolicies(policy)
      ? Object.entries(policy)
      : [['all', policy] as const]

    for (const [environment, environmentPolicy] of policiesByEnvironment) {
      for (const directive of directives) {
        if (!(hashDirectiveKeys[directive] in environmentPolicy)) {
          throw new Error(
            `CSP hash directive ${directive} is missing from ${mode} policy for ${environment} environment`,
          )
        }
      }
    }
  }
}

export const serializeContentSecurityPolicyByEnvironment = (
  policy: ContentSecurityPolicy | EnvironmentContentSecurityPolicies,
): EnvironmentVariableValue | undefined => {
  if (policy === null || typeof policy !== 'object' || Array.isArray(policy)) {
    throw new Error('CSP policy must be a directive object')
  }

  if (!isEnvironmentPolicies(policy)) {
    const serialized = serializeContentSecurityPolicy(policy)
    return serialized || undefined
  }

  for (const environment of environmentNames) {
    if (!(environment in policy)) {
      throw new Error(
        `Environment-specific CSP policies must define dev, staging, and prod (missing ${environment})`,
      )
    }
  }
  const unknownKeys = Object.keys(policy).filter(
    (key) => !environmentPolicyKeys.includes(key),
  )
  if (unknownKeys.length > 0) {
    throw new Error(`Unknown CSP environment: ${unknownKeys.join(', ')}`)
  }

  const serialized = {
    dev: serializeContentSecurityPolicy(policy.dev),
    staging: serializeContentSecurityPolicy(policy.staging),
    prod: serializeContentSecurityPolicy(policy.prod),
    ...(policy.local
      ? { local: serializeContentSecurityPolicy(policy.local) }
      : {}),
  }

  return Object.values(serialized).some(Boolean) ? serialized : undefined
}

import type {
  ContentSecurityPolicy,
  EnvironmentContentSecurityPolicies,
} from './content-security-policy'

export type ApplicationCspEnvironment = 'local' | 'dev' | 'staging' | 'prod'

type SourceDirective = {
  [Directive in keyof ContentSecurityPolicy]-?: NonNullable<
    ContentSecurityPolicy[Directive]
  > extends readonly string[]
    ? Directive
    : never
}[keyof ContentSecurityPolicy]

export type ApplicationContentSecurityPolicyAdditions = Partial<
  Pick<ContentSecurityPolicy, SourceDirective>
>

export type ApplicationContentSecurityPolicyAdditionsByEnvironment = Partial<
  Record<ApplicationCspEnvironment, ApplicationContentSecurityPolicyAdditions>
>

const datadogBrowserIntake = 'https://browser-intake-datadoghq.eu'

export const applicationContentSecurityPolicyBase: ContentSecurityPolicy = {
  defaultSrc: ["'self'"],
  baseUri: ["'self'"],
  objectSrc: ["'none'"],
  manifestSrc: ["'self'"],
  scriptSrc: ["'self'", 'https://plausible.io'],
  scriptSrcAttr: ["'none'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  styleSrcAttr: ["'unsafe-inline'"],
  styleSrcElem: ["'self'"],
  fontSrc: ["'self'", 'data:'],
  imgSrc: ["'self'", 'data:', 'blob:', 'https://images.ctfassets.net'],
  mediaSrc: ["'self'", 'data:', 'blob:'],
  workerSrc: ["'self'", 'blob:'],
  frameSrc: ["'none'"],
  frameAncestors: ["'none'"],
  formAction: ["'self'"],
  connectSrc: [
    "'self'",
    'https://plausible.io',
    'https://s3.eu-west-1.amazonaws.com',
    'https://*.s3.eu-west-1.amazonaws.com',
  ],
}

const appendSources = (
  policy: ContentSecurityPolicy,
  additions: ApplicationContentSecurityPolicyAdditions = {},
): ContentSecurityPolicy => {
  const merged: ContentSecurityPolicy = { ...policy }

  for (const [directive, sources] of Object.entries(additions) as Array<
    [SourceDirective, readonly string[]]
  >) {
    const existing = policy[directive] as readonly string[] | undefined
    merged[directive] = [
      ...(existing?.length === 1 && existing[0] === "'none'"
        ? []
        : existing ?? []),
      ...sources,
    ] as never
  }

  return merged
}

const policyForEnvironment = (
  environment: ApplicationCspEnvironment,
  additions: ApplicationContentSecurityPolicyAdditions = {},
): ContentSecurityPolicy =>
  appendSources(
    appendSources(applicationContentSecurityPolicyBase, {
      connectSrc: environment === 'local' ? [] : [datadogBrowserIntake],
      workerSrc:
        environment === 'local' ? ['https://assets.ctfassets.net'] : [],
    }),
    additions,
  )

export const applicationContentSecurityPolicies = (
  additions: ApplicationContentSecurityPolicyAdditionsByEnvironment = {},
): EnvironmentContentSecurityPolicies => ({
  local: policyForEnvironment('local', additions.local),
  dev: policyForEnvironment('dev', additions.dev),
  staging: policyForEnvironment('staging', additions.staging),
  prod: policyForEnvironment('prod', additions.prod),
})

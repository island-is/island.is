interface ProtectedApplicationUrlInput {
  host?: string
  protocol?: string
  slug: string
  id: string
  step?: number
}

const isLocalHost = (host?: string): boolean =>
  host?.startsWith('localhost') === true ||
  host?.startsWith('127.0.0.1') === true

export const buildProtectedApplicationUrl = ({
  host,
  protocol,
  slug,
  id,
  step,
}: ProtectedApplicationUrlInput): string => {
  const path = `/umsoknir/${slug}/${id}${
    step !== undefined ? `?step=${step}` : ''
  }`

  if (!host) {
    return path
  }

  const resolvedProtocol = protocol ?? (isLocalHost(host) ? 'http' : 'https')

  return `${resolvedProtocol}://${host}${path}`
}

// The application system's root (the legacy form). The BFF only accepts an
// absolute target, so without a host only the path is returned.
export const buildApplicationSystemRootUrl = ({
  host,
  protocol,
}: {
  host?: string
  protocol?: string
}): string => {
  if (!host) {
    return '/umsoknir'
  }

  const resolvedProtocol = protocol ?? (isLocalHost(host) ? 'http' : 'https')

  return `${resolvedProtocol}://${host}/umsoknir`
}

export const buildLoginHandoffUrl = (targetLinkUri: string): string =>
  `/auth/login?target_link_uri=${encodeURIComponent(targetLinkUri)}`

export const buildBffLoginUrl = (targetLinkUri: string): string =>
  `/bff/login?target_link_uri=${encodeURIComponent(targetLinkUri)}`

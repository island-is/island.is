import {
  PasskeyCreateRequest,
  PasskeyCreateResult,
  PasskeyGetRequest,
  PasskeyGetResult,
} from 'react-native-passkey'
import {
  AuthPasskeyAuthenticationOptions,
  AuthPasskeyRegistrationOptions,
} from '../../graphql/types/schema'

/**
 * Pad with '=' until it's a multiple of four
 * (4 - (85 % 4 = 1) = 3) % 4 = 3 padding
 * (4 - (86 % 4 = 2) = 2) % 4 = 2 padding
 * (4 - (87 % 4 = 3) = 1) % 4 = 1 padding
 * (4 - (88 % 4 = 0) = 4) % 4 = 0 padding
 */
export const padChallenge = (challenge: string) => {
  const padLength = (4 - (challenge.length % 4)) % 4
  const paddedChallenge = challenge.padEnd(challenge.length + padLength, '=')
  return paddedChallenge
}

export const convertRegisterResultsToBase64Url = (
  result: PasskeyCreateResult,
) => {
  return {
    ...result,
    type: 'public-key',
    id: convertBase64StringToBase64Url(result.id),
    rawId: convertBase64StringToBase64Url(result.rawId),
    clientExtensionResults: {},
    response: {
      ...result.response,
      clientDataJSON: convertBase64StringToBase64Url(
        result.response.clientDataJSON,
      ),
      attestationObject: convertBase64StringToBase64Url(
        result.response.attestationObject,
      ),
    },
  }
}

export const convertAuthenticationResultsToBase64Url = (
  result: PasskeyGetResult,
) => {
  return {
    ...result,
    type: 'public-key',
    id: convertBase64StringToBase64Url(result.id),
    rawId: convertBase64StringToBase64Url(result.rawId),
    clientExtensionResults: {},
    response: {
      ...result.response,
      authenticatorData: convertBase64StringToBase64Url(
        result.response.authenticatorData,
      ),
      signature: convertBase64StringToBase64Url(result.response.signature),
      clientDataJSON: convertBase64StringToBase64Url(
        result.response.clientDataJSON,
      ),
    },
  }
}

export const formatAuthenticationOptions = (
  options: AuthPasskeyAuthenticationOptions,
): PasskeyGetRequest => {
  // @todo migration
  // Need to map correctly to spec
  return {
    ...options,
    challenge: padChallenge(convertBase64UrlToBase64String(options.challenge)),
  } as PasskeyGetRequest;
}

export const formatRegisterOptions = (
  options: AuthPasskeyRegistrationOptions,
): PasskeyCreateRequest => {
  // @todo migration
  // Need to map correctly to spec
  return {
    ...options,
    challenge: padChallenge(convertBase64UrlToBase64String(options.challenge)),
    rp: {
      id: options.rp.id!, // Already validated before entering this function
      name: options.rp.name,
    },
    attestation: options.attestation || undefined,
    timeout: options.timeout || undefined,
    extensions: options.extensions || undefined,
    excludeCredentials: options.excludeCredentials || undefined,
    authenticatorSelection: options.authenticatorSelection
      ? {
          residentKey: options.authenticatorSelection.residentKey || undefined,
          requireResidentKey:
            options.authenticatorSelection.requireResidentKey || undefined,
          userVerification:
            options.authenticatorSelection.userVerification || undefined,
        }
      : undefined,
  } as PasskeyCreateRequest;
}

export const convertBase64StringToBase64Url = (base64String: string) => {
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export const convertBase64UrlToBase64String = (base64Url: string) => {
  return base64Url.replace(/-/g, '+').replace(/_/g, '/')
}

const MY_PAGES_PATH = '/minarsidur'
const APPLICATIONS_PATH = '/umsoknir'
const allowedPaths = [MY_PAGES_PATH, APPLICATIONS_PATH]

export const addPasskeyAsLoginHint = (
  url: string,
  authenticationResponse: string,
) => {
  if (!doesUrlSupportPasskey(url)) {
    return
  }

  const origin = extractProtocolAndDomain(url)

  if (origin.length === 0) {
    return false
  }

  const matchedPath = allowedPaths.find((path) => url.includes(path))

  if (matchedPath) {
    return `${origin}/bff/login?login_hint=passkey:${authenticationResponse}&target_link_uri=${encodeURIComponent(
      url,
    )}`
  }
}

export const doesUrlSupportPasskey = (url: string): boolean => {
  // Check if domain is correct and url includes /minarsidur or /umsoknir
  if (
    (url.startsWith('https://beta.dev01.devland.is') ||
      url.startsWith('https://beta.staging01.devland.is') ||
      url.startsWith('https://island.is')) &&
    (url.includes(MY_PAGES_PATH) || url.includes(APPLICATIONS_PATH))
  ) {
    return true
  }
  return false
}

function extractProtocolAndDomain(url: string): string {
  const pattern = /^(https?:\/\/)?(www\.)?([^/:]+)/i
  const match = url.match(pattern)
  if (match) {
    const protocol = match[1] ? match[1] : ''
    const domain = match[3]
    return `${protocol}${domain}`
  }
  return ''
}

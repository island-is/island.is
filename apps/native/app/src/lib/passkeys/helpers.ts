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
  return {
    challenge: options.challenge,
    rpId: options.rpId,
    timeout: options.timeout || undefined,
    userVerification: options.userVerification || undefined,
    allowCredentials: options.allowCredentials?.map((cred) => ({
      id: cred.id,
      type: cred.type,
      transports: cred.transports || undefined,
    })),
  } as PasskeyGetRequest
}

export const formatRegisterOptions = (
  options: AuthPasskeyRegistrationOptions,
): PasskeyCreateRequest => {
  const result = {
    challenge: options.challenge,
    rp: {
      id: options.rp.id!, // Already validated before entering this function
      name: options.rp.name,
    },
    user: {
      id: options.user.id,
      name: options.user.name,
      displayName: options.user.displayName,
    },
    pubKeyCredParams: options.pubKeyCredParams.map((p) => ({
      alg: p.alg,
      type: p.type,
    })),
    attestation: options.attestation || undefined,
    timeout: options.timeout || undefined,
    excludeCredentials: options.excludeCredentials?.map((cred) => ({
      id: cred.id,
      type: cred.type,
      transports: cred.transports || undefined,
    })),
    authenticatorSelection: options.authenticatorSelection
      ? {
          residentKey: options.authenticatorSelection.residentKey || undefined,
          requireResidentKey:
            options.authenticatorSelection.requireResidentKey || undefined,
          userVerification:
            options.authenticatorSelection.userVerification || undefined,
        }
      : undefined,
  } as PasskeyCreateRequest
  return result
}

export const convertBase64StringToBase64Url = (base64String: string) => {
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
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

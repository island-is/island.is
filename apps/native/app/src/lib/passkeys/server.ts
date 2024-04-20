import {
  PasskeyRegistrationResult,
  PasskeyAuthenticationResult,
} from 'react-native-passkey'

interface PublicKeyCredentialDescriptor {
  type: string
  id: string
  transports?: Array<string>
}

export interface PasskeyRegistrationRequest {
  challenge: string
  rp: {
    id: string
    name: string
  }
  user: {
    id: string
    name: string
    displayName: string
  }
  pubKeyCredParams: Array<{
    type: string
    alg: number
  }>
  timeout?: number
  excludeCredentials?: Array<PublicKeyCredentialDescriptor>
  authenticatorSelection?: {
    authenticatorAttachment?: string
    requireResidentKey?: boolean
    residentKey?: string
    userVerification?: string
  }
  attestation?: string
  extensions?: Record<string, unknown>
}

interface PasskeyAuthenticationRequest {
  challenge: string
  rpId: string
  timeout?: number
  allowCredentials?: Array<PublicKeyCredentialDescriptor>
  userVerification?: string
  extensions?: Record<string, unknown>
}

interface VerifyResponse {
  verified: boolean
}

// Home
export const IP_ADDRESS = '192.168.86.71'
// Work
//export const IP_ADDRESS = '192.168.1.36'

// Get registration options
export const getRegistrationOptions =
  async (): Promise<PasskeyRegistrationRequest> => {
    return await fetch(
      `http://${IP_ADDRESS}:8000/generate-registration-options`,
    ).then((response) => response.json())
  }

// Verify registration
export const verifyRegister = async (
  result: PasskeyRegistrationResult,
): Promise<VerifyResponse> => {
  return await fetch(`http://${IP_ADDRESS}:8000/verify-registration`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(result),
  }).then((response) => response.json())
}

// Get authentication options
export const getAuthenticationOptions =
  async (): Promise<PasskeyAuthenticationRequest> => {
    return await fetch(
      `http://${IP_ADDRESS}:8000/generate-authentication-options`,
    ).then((response) => response.json())
  }

// Verify authentication
export const verifyAuthentication = async (
  result: PasskeyAuthenticationResult,
): Promise<VerifyResponse> => {
  return await fetch(`http://${IP_ADDRESS}:8000/verify-authentication`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(result),
  }).then((response) => response.json())
}

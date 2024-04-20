import { btoa, atob } from 'react-native-quick-base64'
import {
  PasskeyRegistrationResult,
  PasskeyAuthenticationResult,
} from 'react-native-passkey'

export interface ClientDataJSON {
  challenge: string
  origin: string
  type: string
}

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
  result: PasskeyRegistrationResult,
) => {
  return {
    ...result,
    type: 'public-key',
    id: convertBase64StringToBase64Url(result.id),
    rawId: convertBase64StringToBase64Url(result.rawId),
    response: {
      ...result.response,
      clientDataJSON: convertClientDataJSON(result.response.clientDataJSON),
      attestationObject: convertBase64StringToBase64Url(
        result.response.attestationObject,
      ),
    },
  }
}

export const convertAuthenticationResultsToBase64Url = (
  result: PasskeyAuthenticationResult,
) => {
  return {
    ...result,
    type: 'public-key',
    id: convertBase64StringToBase64Url(result.id),
    rawId: convertBase64StringToBase64Url(result.rawId),
    response: {
      ...result.response,
      authenticatorData: convertBase64StringToBase64Url(
        result.response.authenticatorData,
      ),
      signature: convertBase64StringToBase64Url(result.response.signature),
      clientDataJSON: convertClientDataJSON(result.response.clientDataJSON),
    },
  }
}

// Server wants challenge to be base64URL but the client sends us it as base64 so we need to unpack clientDataJSON and fix it
export const convertClientDataJSON = (clientDataJSONString: string) => {
  const decodedClientDataJSONString = atob(clientDataJSONString)

  const clientDataJSON: ClientDataJSON = JSON.parse(decodedClientDataJSONString)

  const decodedChallenge = atob(padChallenge(clientDataJSON.challenge))

  const updatedClientDataJSON = {
    ...clientDataJSON,
    challenge: decodedChallenge,
    origin: 'http://island.is:8000', //needed since the server is running on this
  }

  console.log({ updatedClientDataJSON })

  return convertBase64StringToBase64Url(
    btoa(JSON.stringify(updatedClientDataJSON)),
  )
}

export const convertBase64StringToBase64Url = (base64String: string) => {
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

import { DdRum, ErrorSource } from '@datadog/mobile-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Application from 'expo-application'
import * as Device from 'expo-device'
import { AppState, Platform } from 'react-native'
import {
  attestWithAppAttest,
  deleteDeviceKey,
  generateDeviceKey,
  getDeviceKeyAttestationChain,
  getDeviceKeyErrorCode,
  isAppAttestSupported,
  isDeviceKeysAvailable,
} from '../../modules/device-keys'
import type { DeviceKey, DevicePublicJwk } from '../../modules/device-keys'
import { config, getConfig } from '../config'

/**
 * Soft launch for native login: attests a throwaway install key against IAS
 * once per install and reports the result, so IAS can count which devices
 * and OS versions fail attestation before login depends on it. IAS issues
 * nothing and nothing changes for the user.
 *
 * The key is deleted straight after it's sent. It uses the install key's
 * alias, so this has to go when native login ships its own install key.
 */

const STORAGE_KEY = '@island/attestation-check'

/** Why the phone couldn't attest at all: the codes IAS counts. */
type AttestationErrorCode =
  | 'not_supported'
  | 'generate_key_failed'
  | 'attest_key_failed'
  | 'server_unavailable'
  | 'key_generation_failed'
  | 'no_certificate_chain'
  | 'unknown'

type Evidence =
  | { jwk: DevicePublicJwk; keyId: string; attestationObject: string }
  | { jwk: DevicePublicJwk; certificateChain: string[] }
  | { error: AttestationErrorCode }

let started = false

/** Runs the check in the background, once the app is in the foreground. */
export function runAttestationCheck() {
  if (started) {
    return
  }
  started = true

  // A background launch can come before the first unlock, when the keys
  // can't be created; that would be counted as a failure.
  if (AppState.currentState === 'active') {
    start()
    return
  }
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      subscription.remove()
      start()
    }
  })
}

function start() {
  check().catch(() => {
    // Network or IAS errors: tried again on a later launch.
  })
}

function shouldRun() {
  // Simulators and emulators can't attest, and dev clients built before the
  // module have no keys.
  return Device.isDevice && isDeviceKeysAvailable()
}

/** IAS trusts the testing app under its own client on production and staging. */
function getClientId() {
  const { id } = getConfig()
  return config.isTestingApp && (id === 'prod' || id === 'staging')
    ? '@island.is/island.dev-appid'
    : config.idsClientId
}

async function check() {
  if (!shouldRun() || (await AsyncStorage.getItem(STORAGE_KEY))) {
    return
  }

  const issuer = getConfig().idsIssuer.replace(/\/+$/, '')
  const clientId = getClientId()
  const platform = Platform.OS === 'ios' ? 'apple' : 'android'
  const headers = { 'Content-Type': 'application/json' }
  // Only logged and counted by IAS, which tidies up the model name itself.
  const device = {
    appVersion: Application.nativeApplicationVersion ?? undefined,
    osVersion: Device.osVersion ?? undefined,
    deviceModel:
      (Platform.OS === 'ios' ? Device.modelId : Device.modelName) ?? undefined,
  }

  // Error reports need a challenge too. No cookies on either request, so
  // nothing ties the result to a person.
  const challengeResponse = await fetch(`${issuer}/app/attestation/challenge`, {
    method: 'POST',
    headers,
    credentials: 'omit',
    body: JSON.stringify({ clientId }),
  })
  if (!challengeResponse.ok) {
    return
  }
  const { challenge } = (await challengeResponse.json()) as {
    challenge?: string
  }
  if (!challenge) {
    return
  }

  try {
    const evidence = await attest(challenge)
    const response = await fetch(`${issuer}/app/attestation`, {
      method: 'POST',
      headers,
      credentials: 'omit',
      body: JSON.stringify({
        clientId,
        platform,
        challenge,
        ...evidence,
        ...device,
      }),
    })
    // A 400 is an answer too: a refused attestation, or a request that
    // retrying won't fix. An expired challenge (the app sat in the
    // background) is tried again on a later launch.
    if (
      response.ok ||
      (response.status === 400 &&
        (await readErrorCode(response)) !== 'invalid_grant')
    ) {
      await AsyncStorage.setItem(STORAGE_KEY, 'true')
    }
  } finally {
    try {
      // Also deletes the App Attest key id.
      deleteDeviceKey('install')
    } catch (error) {
      reportError('delete_key_failed', error)
    }
  }
}

/** IAS only gets a code, so the error behind it goes to Datadog. */
function reportError(code: string, error: unknown) {
  if (__DEV__) {
    return
  }
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined
  DdRum.addError(
    `Attestation check: ${code}: ${message}`,
    ErrorSource.CUSTOM,
    stack ?? '',
  ).catch(() => {
    // noop
  })
}

async function readErrorCode(response: Response) {
  try {
    return ((await response.json()) as { error?: string }).error
  } catch {
    return undefined
  }
}

async function attest(challenge: string): Promise<Evidence> {
  try {
    return Platform.OS === 'ios'
      ? await attestIos(challenge)
      : await attestAndroid(challenge)
  } catch (error) {
    reportError('unknown', error)
    return { error: 'unknown' }
  }
}

async function attestIos(challenge: string): Promise<Evidence> {
  if (!isAppAttestSupported()) {
    return { error: 'not_supported' }
  }

  let key: DeviceKey
  try {
    key = await generateDeviceKey('install')
  } catch (error) {
    reportError('key_generation_failed', error)
    return { error: 'key_generation_failed' }
  }

  try {
    // App Attest attests a key of its own; the client data ties it to the
    // install key.
    const { keyId, attestationObject } = await attestWithAppAttest(
      `${challenge}.${key.thumbprint}`,
    )
    return { jwk: key.publicJwk, keyId, attestationObject }
  } catch (error) {
    const code = getAppAttestErrorCode(error)
    reportError(code, error)
    return { error: code }
  }
}

function getAppAttestErrorCode(error: unknown): AttestationErrorCode {
  switch (getDeviceKeyErrorCode(error)) {
    case 'ERR_DEVICE_KEY_ATTESTATION_UNSUPPORTED':
      return 'not_supported'
    case 'ERR_DEVICE_KEY_ATTESTATION_UNAVAILABLE':
      return 'server_unavailable'
    case 'ERR_DEVICE_KEY_ATTESTATION_KEY_FAILED':
      return 'generate_key_failed'
    default:
      return 'attest_key_failed'
  }
}

async function attestAndroid(challenge: string): Promise<Evidence> {
  let key: DeviceKey
  try {
    // The key's attestation certificate carries the challenge.
    key = await generateDeviceKey('install', {
      attestationChallenge: challenge,
    })
  } catch (error) {
    reportError('key_generation_failed', error)
    return { error: 'key_generation_failed' }
  }

  const certificateChain = getDeviceKeyAttestationChain('install') ?? []
  if (certificateChain.length < 2) {
    return { error: 'no_certificate_chain' }
  }
  return { jwk: key.publicJwk, certificateChain }
}

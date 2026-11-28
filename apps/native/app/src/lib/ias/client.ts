import type {
  DeviceKey,
  DeviceKeyErrorCode,
} from '../../../modules/device-keys'
import type { AttestationFailureReason } from './errors'
import {
  AttestationLostError,
  DeviceAttestationError,
  getIasErrorCode,
  IasError,
  isAppAttestUnavailable,
  isAppLoginRemoved,
  isAttestationChallengeUnknown,
  isBiometricKeyInvalidated,
  isIasUnreachable,
} from './errors'
import { attestationPop, deviceKeyAssertion, dpopProof } from './jwt'
import { sleep } from './sleep'
import type {
  AttestationEvidence,
  CibaRequest,
  IasClient,
  IasDevice,
  IasStorage,
  IasTokens,
  StoredAttestation,
} from './types'

export interface IasClientOptions {
  issuer: string
  clientId: string
  scopes: string[]
  /**
   * About the app and the phone, sent with POST /app/attestation. IAS only
   * logs and counts them, to see which devices fail attestation.
   */
  deviceDetails?: DeviceDetails
  device: IasDevice
  storage: IasStorage
}

export interface DeviceDetails {
  /** As the app has it, e.g. 26.11.06 */
  appVersion?: string
  osVersion?: string
  /** The phone's own name: the iOS machine identifier, or Build.MODEL */
  deviceModel?: string
}

interface RequestOptions {
  /** Client attestation headers, renewed on 401 invalid_client */
  attested?: boolean
  /** Before login: attest a new install key when renewal can't work */
  allowNewKey?: boolean
  /** A DPoP proof, for token requests */
  dpop?: boolean
  /** Sent as `Authorization: DPoP`, always with a proof that hashes it */
  accessToken?: string
  form?: Record<string, string>
  json?: unknown
  signal?: AbortSignal
}

interface AttestationResponse {
  clientAttestation: string
  expiresIn: number
}

interface CibaResponse {
  auth_req_id: string
  expires_in: number
  interval?: number
  verification_code: string
  login_method: 'sim' | 'app'
}

interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  id_token?: string
  scope?: string
}

const CIBA_GRANT = 'urn:openid:params:grant-type:ciba'
const DEVICE_KEY_GRANT = 'urn:island.is:params:oauth:grant-type:device-key'
// Renew a little early, for clock skew between the app and IAS.
const RENEW_MARGIN_MS = 60_000
// When Apple's App Attest service is down, the waits before trying again.
// Most outages are short; the person is waiting to log in meanwhile.
const APP_ATTEST_RETRY_DELAYS_MS = [2_000, 4_000]
// How long a request to IAS may take before it counts as failed: without a
// limit a stalled connection waits forever on Android.
const REQUEST_TIMEOUT_MS = 15_000

/**
 * fetch, failing with a TimeoutError when IAS doesn't answer in time, and a
 * NetworkError when the request doesn't reach it. The caller's own `signal`
 * still cancels it, as an AbortError.
 */
async function fetchWithTimeout(
  url: string,
  init: Omit<RequestInit, 'signal'>,
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (signal?.aborted) {
    controller.abort()
  } else {
    signal?.addEventListener('abort', abort)
  }
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, REQUEST_TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (error) {
    if (timedOut) {
      throw Object.assign(
        new Error(
          `IAS didn't answer in ${REQUEST_TIMEOUT_MS / 1000} s: ${url}`,
        ),
        { name: 'TimeoutError' },
      )
    }
    if (signal?.aborted) {
      throw error
    }
    // An answer, even an error status, resolves: fetch rejects only when
    // none came, e.g. without a connection.
    throw Object.assign(
      new Error(
        `Couldn't reach IAS (${
          error instanceof Error ? error.message : String(error)
        }): ${url}`,
      ),
      { name: 'NetworkError', cause: error },
    )
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}

const encodeForm = (values: Record<string, string>) =>
  Object.entries(values)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&')

/** IAS's reason when the phone couldn't create the platform evidence. */
function evidenceFailureReason(
  os: IasDevice['os'],
  error: unknown,
): AttestationFailureReason {
  const code = (error as { code?: DeviceKeyErrorCode } | null)?.code
  switch (code) {
    case 'ERR_DEVICE_KEY_ATTESTATION_UNSUPPORTED':
      return 'not_supported'
    case 'ERR_DEVICE_KEY_ATTESTATION_UNAVAILABLE':
      return 'server_unavailable'
    case 'ERR_DEVICE_KEY_ATTESTATION_KEY_FAILED':
      return 'generate_key_failed'
    default:
      // Only App Attest does more than read the key's certificates.
      return os === 'ios' ? 'attest_key_failed' : 'unknown'
  }
}

/** The in-flight promise while one runs, so concurrent callers share it. */
function shared<T>(run: () => Promise<T>): () => Promise<T> {
  let current: Promise<T> | null = null
  return () => {
    current ??= run().finally(() => {
      current = null
    })
    return current
  }
}

export function createIasClient(options: IasClientOptions): IasClient {
  const { clientId, device, storage } = options
  const issuer = options.issuer.replace(/\/+$/, '')
  const scope = options.scopes.join(' ')
  const signWithInstallKey = (data: string) => device.signWithInstallKey(data)

  let cachedAttestation: StoredAttestation | null | undefined
  // A logout still ending the app login on IAS, after the app stopped
  // waiting for it. A login waits, so it can't remove the new app login.
  let loggingOut: Promise<unknown> = Promise.resolve()
  // IAS's latest nonces, from any response: proofs are fresh by these, not by
  // the phone's clock. Kept in memory only.
  const nonces: { challenge?: string; dpop?: string } = {}

  function requireInstallKey(): DeviceKey {
    const key = device.getInstallKey()
    if (!key) {
      throw new Error('This install has no install key')
    }
    return key
  }

  /**
   * The stored attestation, if it's for this issuer, client and key. One
   * saved without its token, from an answer that had none, doesn't count.
   */
  async function currentAttestation(): Promise<StoredAttestation | null> {
    if (cachedAttestation === undefined) {
      cachedAttestation = await storage.getAttestation()
    }
    const key = device.getInstallKey()
    const attestation = cachedAttestation
    return attestation?.clientAttestation &&
      key &&
      attestation.issuer === issuer &&
      attestation.clientId === clientId &&
      attestation.thumbprint === key.thumbprint
      ? attestation
      : null
  }

  async function saveAttestation(
    { clientAttestation, expiresIn }: AttestationResponse,
    key: DeviceKey,
    endpoint: string,
  ): Promise<StoredAttestation> {
    if (!clientAttestation || typeof expiresIn !== 'number') {
      throw new Error(`${endpoint} answered without a client attestation`)
    }
    const attestation = {
      issuer,
      clientId,
      thumbprint: key.thumbprint,
      clientAttestation,
      expiresAt: Date.now() + expiresIn * 1000,
    }
    await storage.setAttestation(attestation)
    cachedAttestation = attestation
    return attestation
  }

  const isFresh = (attestation: StoredAttestation) =>
    attestation.expiresAt > Date.now() + RENEW_MARGIN_MS

  async function getAttestationChallenge(): Promise<string> {
    const { challenge } = await request<{ challenge: string }>(
      'POST',
      '/app/attestation/challenge',
      { json: { clientId } },
    )
    return challenge
  }

  /**
   * A new install key, attested (spec section 1). Starts again with a new
   * challenge once when IAS no longer knows the first, and a little later
   * when Apple's service is down. When the phone still can't attest, IAS is
   * told why.
   */
  const attestNewInstall = shared(async (): Promise<StoredAttestation> => {
    let challengeRenewed = false
    let appAttestRetries = 0
    for (;;) {
      const challenge = await getAttestationChallenge()
      try {
        return await attestInstall(challenge)
      } catch (error) {
        if (isAttestationChallengeUnknown(error) && !challengeRenewed) {
          challengeRenewed = true
        } else if (
          isAppAttestUnavailable(error) &&
          appAttestRetries < APP_ATTEST_RETRY_DELAYS_MS.length
        ) {
          await sleep(APP_ATTEST_RETRY_DELAYS_MS[appAttestRetries++])
        } else {
          if (error instanceof DeviceAttestationError) {
            // IAS never saw this challenge, so it can carry the report.
            void reportAttestationFailure(challenge, error.reason, error.detail)
          }
          throw error
        }
      }
    }
  })

  async function attestInstall(challenge: string): Promise<StoredAttestation> {
    let key: DeviceKey
    try {
      // On Android the key's attestation certificate carries the challenge.
      key = await device.generateInstallKey(
        device.os === 'android' ? challenge : undefined,
      )
    } catch (error) {
      throw new DeviceAttestationError('key_generation_failed', error)
    }
    const evidence = await createEvidence(key, challenge)
    const body = {
      clientId,
      jwk: key.publicJwk,
      challenge,
      ...evidence,
      ...options.deviceDetails,
    }
    const response = await request<AttestationResponse>(
      'POST',
      '/app/attestation',
      { json: body },
    )
    return saveAttestation(response, key, 'POST /app/attestation')
  }

  async function createEvidence(
    key: DeviceKey,
    challenge: string,
  ): Promise<AttestationEvidence> {
    let evidence: AttestationEvidence
    try {
      evidence = await device.attestInstallKey(key, challenge)
    } catch (error) {
      throw new DeviceAttestationError(
        evidenceFailureReason(device.os, error),
        error,
      )
    }
    // The key's certificate and at least the one that signed it.
    if (
      evidence.platform === 'android' &&
      evidence.certificateChain.length < 2
    ) {
      throw new DeviceAttestationError('no_certificate_chain')
    }
    return evidence
  }

  /**
   * Tells IAS the phone couldn't attest, so the device is counted. Nothing
   * comes of it for the person, so its own failures are ignored.
   */
  async function reportAttestationFailure(
    challenge: string,
    reason: AttestationFailureReason,
    /** The system's own error code, e.g. "DCError 3": only logged by IAS */
    detail?: string,
  ) {
    try {
      await request('POST', '/app/attestation', {
        json: {
          clientId,
          platform: device.os === 'ios' ? 'apple' : 'android',
          challenge,
          error: reason,
          ...(detail ? { errorDetail: detail } : {}),
          ...options.deviceDetails,
        },
      })
    } catch {
      // Network or IAS errors: the next failure is reported again.
    }
  }

  /** Same install key, no new evidence. Needs an app login. */
  const renew = shared(async () => {
    const key = requireInstallKey()
    const response = await send('POST', '/app/attestation/renew', {
      attested: true,
    })
    const attestation = await saveAttestation(
      await parse<AttestationResponse>(response, 'POST /app/attestation/renew'),
      key,
      'POST /app/attestation/renew',
    )
    return attestation
  })

  /**
   * A client attestation to send. Only `allowNewKey` (before login) may make
   * a new install key: after login the app login is bound to this one.
   * `refused`: IAS refused the stored one although it hasn't expired.
   */
  async function ensureAttested(
    allowNewKey: boolean,
    refused = false,
  ): Promise<StoredAttestation> {
    const current = await currentAttestation()
    if (current && isFresh(current) && !refused) {
      return current
    }
    if (current) {
      try {
        return await renew()
      } catch (error) {
        if (!(allowNewKey && isAppLoginRemoved(error))) {
          throw error
        }
      }
    }
    if (!allowNewKey) {
      throw new AttestationLostError()
    }
    return attestNewInstall()
  }

  async function createProof(
    method: string,
    url: string,
    { nonce, accessToken }: { nonce?: string; accessToken?: string },
  ): Promise<string> {
    return dpopProof(signWithInstallKey, {
      jwk: requireInstallKey().publicJwk,
      method,
      url,
      jti: device.randomUUID(),
      // A proof that comes with an access token is bound to it (RFC 9449).
      ath: accessToken ? await device.sha256(accessToken) : undefined,
      nonce,
    })
  }

  async function send(
    method: string,
    path: string,
    options: RequestOptions,
    isRetry = false,
  ): Promise<Response> {
    const { attested, dpop, accessToken, form, json, signal } = options
    const url = issuer + path
    const headers: Record<string, string> = {}

    if (attested) {
      const attestation = await currentAttestation()
      if (!attestation) {
        throw new Error('This install has no client attestation')
      }
      headers['OAuth-Client-Attestation'] = attestation.clientAttestation
      headers['OAuth-Client-Attestation-PoP'] = await attestationPop(
        signWithInstallKey,
        {
          clientId,
          issuer,
          jti: device.randomUUID(),
          challenge: nonces.challenge,
        },
      )
    }
    // An access token is only ever sent with a proof.
    if (dpop || accessToken) {
      headers.DPoP = await createProof(method, url, {
        nonce: nonces.dpop,
        accessToken,
      })
    }
    if (accessToken) {
      headers.Authorization = `DPoP ${accessToken}`
    }

    let body: string | undefined
    if (form) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
      body = encodeForm(form)
    } else if (json !== undefined) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(json)
    }

    const response = await fetchWithTimeout(
      url,
      { method, headers, body },
      signal,
    )
    nonces.challenge =
      response.headers.get('OAuth-Client-Attestation-Challenge') ??
      nonces.challenge
    nonces.dpop = response.headers.get('DPoP-Nonce') ?? nonces.dpop

    // A proof with a missing or expired nonce, e.g. after the app was idle,
    // did nothing: sign new ones with this answer's nonces and send it again.
    if (!isRetry && (response.status === 400 || response.status === 401)) {
      const { error } = await readError(response.clone())
      if (error === 'use_attestation_challenge' || error === 'use_dpop_nonce') {
        return send(method, path, options, true)
      }
    }
    return response
  }

  async function readError(response: Response) {
    let body: Record<string, unknown> = {}
    const text = await response.text()
    try {
      const parsed: unknown = text ? JSON.parse(text) : {}
      // Also `null` or a bare string is valid JSON.
      if (parsed && typeof parsed === 'object') {
        body = parsed as Record<string, unknown>
      }
    } catch {
      // Not JSON: fall back to the status and WWW-Authenticate.
    }
    const field = (name: string) =>
      typeof body[name] === 'string' ? (body[name] as string) : undefined
    // Bearer/DPoP-protected endpoints put the error in WWW-Authenticate.
    const challenge = response.headers.get('WWW-Authenticate') ?? ''
    return {
      error:
        field('error') ??
        /error="([^"]*)"/.exec(challenge)?.[1] ??
        `http_${response.status}`,
      description:
        field('error_description') ??
        /error_description="([^"]*)"/.exec(challenge)?.[1],
    }
  }

  async function parse<T>(response: Response, endpoint: string): Promise<T> {
    if (!response.ok) {
      const { error, description } = await readError(response)
      throw new IasError(error, description, response.status, endpoint)
    }
    const text = await response.text()
    return (text ? JSON.parse(text) : {}) as T
  }

  async function request<T>(
    method: string,
    path: string,
    requestOptions: RequestOptions = {},
  ): Promise<T> {
    const endpoint = `${method} ${path.split('?')[0]}`
    if (requestOptions.attested) {
      await ensureAttested(requestOptions.allowNewKey ?? false)
    }

    let response = await send(method, path, requestOptions)
    // An expired or invalid attestation: renew it, or before login attest a
    // new key when there's no app login to renew with, and retry once.
    if (requestOptions.attested && response.status === 401) {
      const { error } = await readError(response.clone())
      if (error === 'invalid_client') {
        await ensureAttested(requestOptions.allowNewKey ?? false, true)
        response = await send(method, path, requestOptions)
      }
    }
    return parse<T>(response, endpoint)
  }

  function toTokens(
    response: TokenResponse,
    previousRefreshToken?: string,
  ): IasTokens {
    return {
      accessToken: response.access_token,
      accessTokenExpirationDate: new Date(
        Date.now() + response.expires_in * 1000,
      ).toISOString(),
      refreshToken: response.refresh_token ?? previousRefreshToken ?? '',
      idToken: response.id_token ?? '',
      tokenType: 'DPoP',
      scopes: response.scope?.split(' ') ?? options.scopes,
    }
  }

  async function token(
    form: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<TokenResponse> {
    return request<TokenResponse>('POST', '/connect/token', {
      attested: true,
      dpop: true,
      form: { client_id: clientId, ...form },
      signal,
    })
  }

  async function startCiba(
    loginHint: string,
    {
      smsCode,
      purpose,
      allowNewKey,
    }: { smsCode?: string; purpose?: string; allowNewKey: boolean },
  ): Promise<CibaRequest> {
    const response = await request<CibaResponse>('POST', '/connect/ciba', {
      attested: true,
      allowNewKey,
      form: {
        client_id: clientId,
        login_hint: loginHint,
        scope,
        ...(smsCode ? { sms_code: smsCode } : {}),
        ...(purpose ? { purpose } : {}),
      },
    })
    return {
      authReqId: response.auth_req_id,
      verificationCode: response.verification_code,
      loginMethod: response.login_method,
      expiresIn: response.expires_in,
      interval: response.interval ?? 5,
    }
  }

  async function revoke(refreshToken: string) {
    await request('POST', '/connect/revocation', {
      attested: true,
      form: {
        client_id: clientId,
        token: refreshToken,
        token_type_hint: 'refresh_token',
      },
    })
  }

  return {
    getInstallThumbprint() {
      return device.getInstallKey()?.thumbprint ?? null
    },

    async startLogin(loginHint, { smsCode } = {}) {
      await loggingOut
      return startCiba(loginHint, { smsCode, allowNewKey: true })
    },

    startElectronicIdUnlock({ purpose } = {}) {
      return startCiba('device', { purpose, allowNewKey: false })
    },

    async waitForApproval(ciba, { signal } = {}) {
      let interval = ciba.interval
      const deadline = Date.now() + ciba.expiresIn * 1000
      // A poll that didn't reach IAS, e.g. while iOS kept the app suspended
      // as the person approved in Auðkennisappið. Polling goes on; it's only
      // the answer if no later poll gets through.
      let unreachable: unknown
      while (Date.now() < deadline) {
        await sleep(interval * 1000, signal)
        try {
          return toTokens(
            await token(
              { grant_type: CIBA_GRANT, auth_req_id: ciba.authReqId },
              signal,
            ),
          )
        } catch (error) {
          const code = getIasErrorCode(error)
          if (isIasUnreachable(error)) {
            unreachable = error
            continue
          }
          unreachable = undefined
          if (code === 'slow_down') {
            interval += 5
          } else if (code !== 'authorization_pending') {
            throw error
          }
        }
      }
      if (unreachable) {
        throw unreachable
      }
      throw new IasError(
        'expired_token',
        'The login request expired',
        400,
        'POST /connect/token',
      )
    },

    isBiometricsEnabled() {
      try {
        return device.getBiometricKey() !== null
      } catch (error) {
        // Some Android devices report an invalidated key as soon as it's read.
        if (isBiometricKeyInvalidated(error)) {
          device.deleteBiometricKey()
        } else {
          // A key that can't be read can't unlock either: electronic ID can.
          console.warn('Could not read the biometric key', error)
        }
        return false
      }
    },

    async enableBiometrics(accessToken) {
      // Android sends the biometric key's own attestation too.
      const challenge =
        device.os === 'android'
          ? (
              await request<{ challenge: string }>(
                'POST',
                '/app/device/challenge',
                { attested: true, json: { purpose: 'biometric-key' } },
              )
            ).challenge
          : undefined
      const key = await device.generateBiometricKey(challenge)
      try {
        await request('POST', '/app/device/biometric-key', {
          attested: true,
          accessToken,
          json: {
            jwk: key.publicJwk,
            ...(challenge
              ? {
                  challenge,
                  certificateChain: device.getBiometricKeyAttestationChain(),
                }
              : {}),
          },
        })
      } catch (error) {
        device.deleteBiometricKey()
        throw error
      }
    },

    async disableBiometrics() {
      try {
        await request('DELETE', '/app/device/biometric-key', {
          attested: true,
        })
      } finally {
        device.deleteBiometricKey()
      }
    },

    async unlockWithBiometrics(prompt) {
      const { challenge } = await request<{ challenge: string }>(
        'POST',
        '/app/device/challenge',
        { attested: true, json: { purpose: 'unlock' } },
      )
      let assertion: string
      try {
        assertion = await deviceKeyAssertion(
          (data) => device.signWithBiometricKey(data, prompt),
          {
            clientId,
            issuer,
            nonce: challenge,
            installJkt: requireInstallKey().thumbprint,
          },
        )
      } catch (error) {
        if (isBiometricKeyInvalidated(error)) {
          device.deleteBiometricKey()
        }
        throw error
      }
      return toTokens(
        await token({
          grant_type: DEVICE_KEY_GRANT,
          device_key_assertion: assertion,
          scope,
        }),
      )
    },

    async refresh(refreshToken) {
      return toTokens(
        await token({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        refreshToken,
      )
    },

    revoke,

    logout(refreshToken) {
      const ending = (async () => {
        try {
          if (refreshToken) {
            // Best effort: DELETE /app/device ends the sessions anyway.
            await revoke(refreshToken).catch(() => undefined)
          }
          await request('DELETE', '/app/device', { attested: true })
        } finally {
          device.deleteBiometricKey()
        }
      })()
      loggingOut = ending.catch(() => undefined)
      return ending
    },
  }
}

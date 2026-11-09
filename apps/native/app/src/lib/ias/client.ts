import type { DeviceKey } from '../../../modules/device-keys'
import {
  getIasErrorCode,
  IasError,
  isAppLoginRemoved,
  isNativeLoginDisabled,
} from './errors'
import { attestationPop, deviceKeyAssertion, dpopProof } from './jwt'
import { sleep } from './sleep'
import type {
  CibaRequest,
  IasClient,
  IasDevice,
  IasStorage,
  IasTokens,
  LoginMode,
  StoredAttestation,
} from './types'

export interface IasClientOptions {
  issuer: string
  clientId: string
  scopes: string[]
  /**
   * Semver without leading zeros (26.11.6), sent on every request: IAS's
   * feature flag can target app versions.
   */
  appVersion: string
  device: IasDevice
  storage: IasStorage
  /** GET /app/config slower than this means the browser login. */
  configTimeoutMs?: number
  /** For dev builds: IAS's verifier tests need real request bodies. */
  onAttestationRequest?: (body: Record<string, unknown>) => void
  /** For dev builds: an expired attestation was renewed. */
  onAttestationRenewed?: () => void
  /** Why getLoginMode chose the browser login, when it was an error. */
  onBrowserFallback?: (error: unknown) => void
}

interface RequestOptions {
  /** Client attestation headers, renewed on 401 invalid_client */
  attested?: boolean
  /** Before login: attest a new install key when renewal can't work */
  allowNewKey?: boolean
  /** A DPoP proof, for token requests */
  dpop?: boolean
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

const encodeForm = (values: Record<string, string>) =>
  Object.entries(values)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&')

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

  function requireInstallKey(): DeviceKey {
    const key = device.getInstallKey()
    if (!key) {
      throw new Error('This install has no install key')
    }
    return key
  }

  /** The stored attestation, if it's for this issuer, client and key. */
  async function currentAttestation(): Promise<StoredAttestation | null> {
    if (cachedAttestation === undefined) {
      cachedAttestation = await storage.getAttestation()
    }
    const key = device.getInstallKey()
    const attestation = cachedAttestation
    return attestation &&
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
  ): Promise<StoredAttestation> {
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

  async function isNativeLoginOn(thumbprint: string): Promise<boolean> {
    const query = encodeForm({
      platform: device.os,
      version: options.appVersion,
      install: thumbprint,
    })
    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      options.configTimeoutMs ?? 5000,
    )
    try {
      const { nativeLogin } = await request<{ nativeLogin?: boolean }>(
        'GET',
        `/app/config?${query}`,
        { signal: controller.signal },
      )
      return nativeLogin === true
    } finally {
      clearTimeout(timeout)
    }
  }

  async function getAttestationChallenge(): Promise<string> {
    const { challenge } = await request<{ challenge: string }>(
      'POST',
      '/app/attestation/challenge',
      { json: { clientId } },
    )
    return challenge
  }

  /**
   * A new install key, attested when native login is on for it (spec
   * sections 0 and 1). Null when it's off.
   */
  const attestNewInstall = shared(
    async (): Promise<StoredAttestation | null> => {
      let challenge: string | undefined
      let key: DeviceKey
      if (device.os === 'android') {
        // The key's attestation certificate carries the challenge, so the
        // challenge comes first.
        challenge = await getAttestationChallenge()
        key = await device.generateInstallKey(challenge)
      } else {
        key = await device.generateInstallKey()
      }

      if (!(await isNativeLoginOn(key.thumbprint))) {
        return null
      }

      challenge ??= await getAttestationChallenge()
      const evidence = await device.attestInstallKey(key, challenge)
      const body = { clientId, jwk: key.publicJwk, challenge, ...evidence }
      options.onAttestationRequest?.(body)
      const response = await request<AttestationResponse>(
        'POST',
        '/app/attestation',
        { json: body },
      )
      return saveAttestation(response, key)
    },
  )

  /** Same install key, no new evidence. Needs an app login. */
  const renew = shared(async () => {
    const key = requireInstallKey()
    const response = await send('POST', '/app/attestation/renew', {
      attested: true,
    })
    const attestation = await saveAttestation(
      await parse<AttestationResponse>(response, 'POST /app/attestation/renew'),
      key,
    )
    options.onAttestationRenewed?.()
    return attestation
  })

  async function ensureAttested(
    allowNewKey: boolean,
  ): Promise<StoredAttestation> {
    const current = await currentAttestation()
    if (current && isFresh(current)) {
      return current
    }
    if (current) {
      try {
        return await renew()
      } catch (error) {
        // Renewal is refused while native login is off, but refreshing
        // still works with the old attestation.
        if (isNativeLoginDisabled(error)) {
          return current
        }
        if (!(allowNewKey && isAppLoginRemoved(error))) {
          throw error
        }
      }
    }
    const attestation = await attestNewInstall()
    if (!attestation) {
      throw new IasError(
        'native_login_disabled',
        undefined,
        200,
        'GET /app/config',
      )
    }
    return attestation
  }

  async function createProof(
    method: string,
    url: string,
    { accessToken, nonce }: { accessToken?: string; nonce?: string } = {},
  ): Promise<string> {
    return dpopProof(signWithInstallKey, {
      jwk: requireInstallKey().publicJwk,
      method,
      url,
      jti: device.randomUUID(),
      ath: accessToken ? await device.sha256(accessToken) : undefined,
      nonce,
    })
  }

  async function send(
    method: string,
    path: string,
    { attested, dpop, accessToken, form, json, signal }: RequestOptions,
    nonce?: string,
  ): Promise<Response> {
    const url = issuer + path
    const headers: Record<string, string> = {
      'X-App-Version': options.appVersion,
    }

    if (attested) {
      const attestation = await currentAttestation()
      if (!attestation) {
        throw new Error('This install has no client attestation')
      }
      headers['OAuth-Client-Attestation'] = attestation.clientAttestation
      headers['OAuth-Client-Attestation-PoP'] = await attestationPop(
        signWithInstallKey,
        { clientId, issuer, jti: device.randomUUID() },
      )
    }
    if (dpop) {
      headers.DPoP = await createProof(method, url, { nonce })
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

    const response = await fetch(url, { method, headers, body, signal })
    const serverNonce = response.headers.get('DPoP-Nonce')
    if (
      dpop &&
      serverNonce &&
      !nonce &&
      (response.status === 400 || response.status === 401)
    ) {
      return send(
        method,
        path,
        { attested, dpop, accessToken, form, json, signal },
        serverNonce,
      )
    }
    return response
  }

  async function readError(response: Response) {
    let body: { error?: string; error_description?: string } = {}
    const text = await response.text()
    try {
      body = text ? JSON.parse(text) : {}
    } catch {
      // Not JSON: fall back to the status and WWW-Authenticate.
    }
    // Bearer/DPoP-protected endpoints put the error in WWW-Authenticate.
    const challenge = response.headers.get('WWW-Authenticate') ?? ''
    return {
      error:
        body.error ??
        /error="([^"]*)"/.exec(challenge)?.[1] ??
        `http_${response.status}`,
      description:
        body.error_description ??
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
    // An expired or invalid attestation: renew it and retry once.
    if (requestOptions.attested && response.status === 401) {
      const { error } = await readError(response.clone())
      if (error === 'invalid_client') {
        await renew()
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
    { smsCode, allowNewKey }: { smsCode?: string; allowNewKey: boolean },
  ): Promise<CibaRequest> {
    const response = await request<CibaResponse>('POST', '/connect/ciba', {
      attested: true,
      allowNewKey,
      form: {
        client_id: clientId,
        login_hint: loginHint,
        scope,
        ...(smsCode ? { sms_code: smsCode } : {}),
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

  const getLoginMode = shared(async (): Promise<LoginMode> => {
    try {
      if (!(await currentAttestation())) {
        return (await attestNewInstall()) ? 'native' : 'browser'
      }
      const attestation = await ensureAttested(true)
      return (await isNativeLoginOn(attestation.thumbprint))
        ? 'native'
        : 'browser'
    } catch (error) {
      options.onBrowserFallback?.(error)
      return 'browser'
    }
  })

  return {
    getLoginMode,

    getInstallThumbprint() {
      return device.getInstallKey()?.thumbprint ?? null
    },

    startLogin(loginHint, { smsCode } = {}) {
      return startCiba(loginHint, { smsCode, allowNewKey: true })
    },

    startElectronicIdUnlock() {
      return startCiba('device', { allowNewKey: false })
    },

    async waitForApproval(ciba, { signal } = {}) {
      let interval = ciba.interval
      const deadline = Date.now() + ciba.expiresIn * 1000
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
          if (code === 'slow_down') {
            interval += 5
          } else if (code !== 'authorization_pending') {
            throw error
          }
        }
      }
      throw new IasError(
        'expired_token',
        'The login request expired',
        400,
        'POST /connect/token',
      )
    },

    isBiometricsEnabled() {
      return device.getBiometricKey() !== null
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
      const assertion = await deviceKeyAssertion(
        (data) => device.signWithBiometricKey(data, prompt),
        {
          clientId,
          issuer,
          nonce: challenge,
          installJkt: requireInstallKey().thumbprint,
        },
      )
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

    async logout(refreshToken) {
      try {
        if (refreshToken) {
          // Best effort: DELETE /app/device ends the sessions anyway.
          await revoke(refreshToken).catch(() => undefined)
        }
        await request('DELETE', '/app/device', { attested: true })
      } finally {
        device.deleteBiometricKey()
      }
    },

    createDpopProof(method, url, accessToken) {
      return createProof(method, url, { accessToken })
    },
  }
}

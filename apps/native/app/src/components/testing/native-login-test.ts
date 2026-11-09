import {
  getDeviceKey,
  getDeviceKeyErrorCode,
} from '../../../modules/device-keys'
import { getConfig } from '@/config'
import { getIasClient, IasClient, IasError } from '@/lib/ias'
import { environmentStore } from '@/stores/environment-store'

// Gervimenn: approval is automatic outside production. IAS allows one app
// login per person, so testing on two phones at once needs two of them.
export const GERVIMENN_PHONES = ['0107789', '0102399', '0103019', '0102989']

// Needs authentication and nothing else.
const PROFILE_QUERY = 'query NativeLoginTest { getUserProfile { nationalId } }'

interface GraphqlError {
  message?: string
  extensions?: {
    code?: string
    problem?: { status?: number; detail?: string }
  }
}

function tokenClaims(jwt: string): { acr?: string } {
  const base64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')))
}

function describeError(error: unknown) {
  if (error instanceof IasError) {
    return error.message
  }
  const code = getDeviceKeyErrorCode(error)
  const message = error instanceof Error ? error.message : String(error)
  return code ? `${code}: ${message}` : message
}

/**
 * One GraphQL request with the DPoP-bound access token, through Cognito like
 * the app's own requests. Only an API that trusts the selected IAS accepts it,
 * so the feature IAS needs the feature environment.
 */
async function queryWithDpop(ias: IasClient, accessToken: string) {
  const cognito = environmentStore.getState().cognito
  if (!cognito || cognito.expiresAt < Date.now()) {
    throw new Error('No Cognito login: tap Cognito → (Login) first')
  }
  const url = `${getConfig().apiUrl.replace(/\/$/, '')}/graphql`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `DPoP ${accessToken}`,
      DPoP: await ias.createDpopProof('POST', url, accessToken),
      'X-Cognito-Token': `Bearer ${cognito.accessToken}`,
    },
    body: JSON.stringify({ query: PROFILE_QUERY }),
  })
  const text = await response.text()
  let errors: GraphqlError[] | undefined
  try {
    errors = (JSON.parse(text) as { errors?: GraphqlError[] }).errors
  } catch {
    // The Cognito proxy answers with its login page.
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 80)}`)
  }
  const error = errors?.[0]
  const status = error?.extensions?.problem?.status ?? response.status
  if (status === 401 || error?.extensions?.code === 'UNAUTHENTICATED') {
    throw new Error(
      `HTTP 401: ${error?.extensions?.problem?.detail ?? error?.message}`,
    )
  }
  // Past authentication, the profile service may still fail for gervimaður.
  return error ? `token accepted, then: ${error.message}` : 'token accepted'
}

/**
 * Biometric unlock with the key enabled by an earlier (Keep) run, without
 * enabling it again. After a biometric enrolment change it should fail with
 * ERR_DEVICE_KEY_INVALIDATED, without a prompt.
 */
export async function runBiometricUnlockTest(
  report: (line: string) => void,
): Promise<boolean> {
  if (getConfig().id === 'mock') {
    report('✗ The Mock environment uses the mock client: switch to Dev')
    return false
  }
  const ias = getIasClient()
  if (!ias.isBiometricsEnabled()) {
    report('✗ Biometrics aren’t enabled: run the login test with (Keep)')
    return false
  }
  try {
    const tokens = await ias.unlockWithBiometrics({
      title: 'Test unlock',
      cancel: 'Cancel',
    })
    report(
      `✓ Unlock with biometrics (acr ${tokenClaims(tokens.accessToken).acr})`,
    )
    // Revoking the new session keeps the app login for the next test.
    await ias.revoke(tokens.refreshToken)
    return true
  } catch (error) {
    report(`✗ Unlock with biometrics: ${describeError(error)}`)
    report(`Biometrics ${ias.isBiometricsEnabled() ? 'still on' : 'now off'}`)
    return false
  }
}

/**
 * Native login end to end on a real device: attestation, login, a GraphQL
 * request, biometric and electronic ID unlock, then logout. Reports one line
 * per step. `keepLogin` skips the logout, so a later run can renew the
 * attestation: renewal needs an app login.
 */
export async function runNativeLoginTest(
  report: (line: string) => void,
  {
    keepLogin = false,
    phone = GERVIMENN_PHONES[0],
  }: { keepLogin?: boolean; phone?: string } = {},
): Promise<boolean> {
  if (getConfig().id === 'mock') {
    report('✗ The Mock environment uses the mock client: switch to Dev')
    return false
  }
  const ias = getIasClient()
  let loggedIn = false
  let refreshToken: string | undefined

  async function step<T>(
    name: string,
    run: () => Promise<T>,
    detail?: (result: T) => string | undefined,
  ): Promise<T> {
    try {
      const result = await run()
      const extra = detail?.(result)
      report(`✓ ${name}${extra ? ` (${extra})` : ''}`)
      return result
    } catch (error) {
      report(`✗ ${name}: ${describeError(error)}`)
      throw error
    }
  }

  async function lock() {
    const token = refreshToken
    refreshToken = undefined
    if (token) {
      await step('Lock', () => ias.revoke(token))
    }
  }

  try {
    const mode = await step(
      'Config and attestation',
      () => ias.getLoginMode(),
      (result) => `${result}, ${getDeviceKey('install')?.securityLevel}`,
    )
    if (mode !== 'native') {
      report('Browser login: Metro has the reason')
      return false
    }

    const login = await step(
      `Log in as gervimaður ${phone}`,
      async () => ias.waitForApproval(await ias.startLogin(phone)),
      (tokens) => `acr ${tokenClaims(tokens.accessToken).acr}`,
    )
    loggedIn = true
    refreshToken = login.refreshToken

    // Not fatal: the other steps only need IAS.
    await step(
      'GraphQL with DPoP',
      () => queryWithDpop(ias, login.accessToken),
      (result) => result,
    ).catch(() => undefined)

    await step(
      'Enable biometrics',
      () => ias.enableBiometrics(login.accessToken),
      () => getDeviceKey('biometric')?.securityLevel,
    )
    await lock()

    const biometric = await step(
      'Unlock with biometrics',
      () =>
        ias.unlockWithBiometrics({ title: 'Test unlock', cancel: 'Cancel' }),
      (tokens) => `acr ${tokenClaims(tokens.accessToken).acr}`,
    )
    refreshToken = biometric.refreshToken
    await lock()

    const electronicId = await step(
      'Unlock with electronic ID',
      async () => ias.waitForApproval(await ias.startElectronicIdUnlock()),
      (tokens) => `acr ${tokenClaims(tokens.accessToken).acr}`,
    )
    refreshToken = electronicId.refreshToken
    return true
  } catch {
    return false
  } finally {
    if (loggedIn && keepLogin) {
      report('Kept the login: run again after an hour to renew')
    } else if (loggedIn) {
      await step('Log out', () => ias.logout(refreshToken)).catch(
        () => undefined,
      )
    }
  }
}

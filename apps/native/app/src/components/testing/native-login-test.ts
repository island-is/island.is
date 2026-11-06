import {
  getDeviceKey,
  getDeviceKeyErrorCode,
} from '../../../modules/device-keys'
import { getIasClient, IasError } from '@/lib/ias'

// Gervimaður: approval is automatic outside production.
const GERVIMADUR_PHONE = '0107789'

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
 * Native login end to end on a real device: attestation, login, biometric
 * and electronic ID unlock, then logout. Reports one line per step.
 */
export async function runNativeLoginTest(
  report: (line: string) => void,
): Promise<boolean> {
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
      'Log in as gervimaður',
      async () => ias.waitForApproval(await ias.startLogin(GERVIMADUR_PHONE)),
      (tokens) => `acr ${tokenClaims(tokens.accessToken).acr}`,
    )
    loggedIn = true
    refreshToken = login.refreshToken

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
    if (loggedIn) {
      await step('Log out', () => ias.logout(refreshToken)).catch(
        () => undefined,
      )
    }
  }
}

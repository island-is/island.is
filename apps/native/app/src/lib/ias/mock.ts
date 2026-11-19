import { IasError } from './errors'
import { sleep } from './sleep'
import type { IasClient, IasTokens } from './types'

export interface MockIasClientOptions {
  /** How long the person takes to approve on their phone */
  approvalDelayMs?: number
}

const MOCK_SMS_CODE = '123'

/**
 * For building the screens without IAS. Login hints pick the outcome:
 * - ending in 000: asks for an SMS code, which is 123
 * - ending in 999: the person declines on their phone
 * - anything else: approved after `approvalDelayMs`
 */
export function createMockIasClient({
  approvalDelayMs = 3000,
}: MockIasClientOptions = {}): IasClient {
  let biometrics = false
  let declines = false
  // Like IAS: 3 tries per code, then start again with a new one.
  let smsAttemptsLeft = 3

  const tokens = (): IasTokens => ({
    accessToken: 'mock-access-token',
    accessTokenExpirationDate: new Date(Date.now() + 3600_000).toISOString(),
    refreshToken: 'mock-refresh-token',
    idToken: 'mock-id-token',
    tokenType: 'DPoP',
    scopes: [],
  })

  return {
    getInstallThumbprint: () => 'mock-install-thumbprint',

    async startLogin(loginHint, { smsCode } = {}) {
      await sleep(500)
      if (loginHint.endsWith('000') && smsCode !== MOCK_SMS_CODE) {
        if (!smsCode) {
          smsAttemptsLeft = 3
          throw new IasError(
            'access_denied',
            'sms_code_required: An SMS code was sent',
            400,
            'POST /connect/ciba',
          )
        }
        smsAttemptsLeft -= 1
        throw new IasError(
          'access_denied',
          `invalid_sms_code: ${smsAttemptsLeft} attempts remaining`,
          400,
          'POST /connect/ciba',
        )
      }
      declines = loginHint.endsWith('999')
      return {
        authReqId: 'mock-auth-req-id',
        verificationCode: '1234',
        loginMethod: loginHint.length === 10 ? 'app' : 'sim',
        expiresIn: 300,
        interval: 1,
      }
    },

    async startElectronicIdUnlock() {
      await sleep(500)
      declines = false
      return {
        authReqId: 'mock-auth-req-id',
        verificationCode: '1234',
        loginMethod: 'sim',
        expiresIn: 300,
        interval: 1,
      }
    },

    async waitForApproval(_request, { signal } = {}) {
      await sleep(approvalDelayMs, signal)
      if (declines) {
        throw new IasError(
          'access_denied',
          'The person declined',
          400,
          'POST /connect/token',
        )
      }
      return tokens()
    },

    isBiometricsEnabled: () => biometrics,

    async enableBiometrics() {
      await sleep(300)
      biometrics = true
    },

    async disableBiometrics() {
      await sleep(300)
      biometrics = false
    },

    async unlockWithBiometrics() {
      await sleep(500)
      if (!biometrics) {
        throw new IasError(
          'invalid_grant',
          'Biometrics are off',
          400,
          'POST /connect/token',
        )
      }
      return tokens()
    },

    async refresh() {
      await sleep(300)
      return tokens()
    },

    async revoke() {
      await sleep(300)
    },

    async logout() {
      await sleep(300)
      biometrics = false
    },
  }
}

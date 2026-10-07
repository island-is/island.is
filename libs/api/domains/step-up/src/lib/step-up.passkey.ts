import { Injectable } from '@nestjs/common'

import { AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { PasskeysApi } from '@island.is/clients/auth/public-api'

export const STEP_UP_PASSKEY_VERIFIER = 'STEP_UP_PASSKEY_VERIFIER'

/** Checks that the person behind a session has just used their own passkey. */
export interface PasskeyVerifier {
  /** Throws when the assertion can't be checked, false when it isn't valid. */
  verify(user: User, passkey: string): Promise<boolean>
}

/**
 * The passkeys are registered with, and verified by, the auth public API: it
 * checks the signature, the one-time challenge, that user verification
 * (Face ID, fingerprint, the phone's PIN) was done, and that the passkey is
 * the signed-in person's own.
 */
@Injectable()
export class PublicApiPasskeyVerifier implements PasskeyVerifier {
  constructor(private readonly passkeysApi: PasskeysApi) {}

  async verify(user: User, passkey: string): Promise<boolean> {
    const result = await this.passkeysApi
      .withMiddleware(new AuthMiddleware(user))
      .passkeysControllerVerifyAuthentication({
        authenticationResponse: { passkey },
      })
    return result.verified === true
  }
}

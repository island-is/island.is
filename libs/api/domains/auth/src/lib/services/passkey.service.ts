import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { PasskeysApi } from '@island.is/clients/auth/public-api'

import { PasskeyRegistrationOptions } from '../models/registrationOptions.model'
import { PasskeyRegistrationVerification } from '../models/verifyRegistration.model'
import { PasskeyRegistrationObject } from '../dto/registrationObject.input'
import { PasskeyAuthenticationOptions } from '../models/authenticationOptions.model'

@Injectable()
export class PasskeyService {
  constructor(private passkeysApi: PasskeysApi) {}

  passkeysApiWithAuth(auth: Auth): PasskeysApi {
    return this.passkeysApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getRegistrationOptions(
    user: User,
  ): Promise<PasskeyRegistrationOptions> {
    const options = await this.passkeysApiWithAuth(
      user,
    ).passkeysControllerGetPasskeyRegistrationOptions()

    return options as PasskeyRegistrationOptions
  }

  verifyRegistration(
    user: User,
    input: PasskeyRegistrationObject,
  ): Promise<PasskeyRegistrationVerification> {
    return this.passkeysApiWithAuth(user).passkeysControllerVerifyRegistration({
      registrationResponse: input,
    })
  }

  async getAuthenticationOptions(
    user: User,
  ): Promise<PasskeyAuthenticationOptions> {
    const options = await this.passkeysApiWithAuth(
      user,
    ).passkeysControllerGetPasskeyAuthenticationOptions()

    return options as PasskeyAuthenticationOptions
  }

  deletePasskey(user: User): Promise<void> {
    return this.passkeysApiWithAuth(user).passkeysControllerDeletePasskey()
  }
}

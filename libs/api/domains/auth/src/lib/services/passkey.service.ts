import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { PasskeysApi } from '@island.is/clients/auth/public-api'

import { PasskeyRegistrationOptions } from '../models/registrationOptions.model'
import { PasskeyRegistrationVerification } from '../models/verifyRegistration.model'
import { PasskeyRegistrationObject } from '../dto/registrationObject.input'
import { PasskeyAuthenticationOptions } from '../models/authenticationOptions.model'
import { PasskeyAuthenticationObject } from '../dto/authenticationObject.input'

@Injectable()
export class PasskeyService {
  constructor(private passkeysApi: PasskeysApi) {}

  passkeysApiWithAuth(auth: Auth): PasskeysApi {
    return this.passkeysApi.withMiddleware(new AuthMiddleware(auth))
  }

  getRegistrationOptions(user: User): Promise<PasskeyRegistrationOptions> {
    return this.passkeysApiWithAuth(
      user,
    ).passkeysControllerGetPasskeyRegistrationOptions()
  }

  verifyRegistration(
    user: User,
    input: PasskeyRegistrationObject,
  ): Promise<PasskeyRegistrationVerification> {
    return this.passkeysApiWithAuth(user).passkeysControllerVerifyRegistration({
      registrationResponse: input,
    })
  }

  getAuthenticationOptions(user: User): Promise<PasskeyAuthenticationOptions> {
    return this.passkeysApiWithAuth(
      user,
    ).passkeysControllerGetPasskeyAuthenticationOptions()
  }

  verifyAuthentication(
    user: User,
    input: PasskeyAuthenticationObject,
  ): Promise<PasskeyRegistrationVerification> {
    return this.passkeysApiWithAuth(
      user,
    ).passkeysControllerVerifyAuthentication({
      authenticationResponse: input,
    })
  }
}

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { RegistrationApi } from '../../gen/fetch/apis'

@Injectable()
export class VehiclePrintingClient {
  constructor(private readonly registrationApi: RegistrationApi) {}

  private registrationApiWithAuth(auth: Auth) {
    return this.registrationApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async requestRegistrationCardPrint(
    auth: User,
    permno: string,
  ): Promise<void> {
    await this.registrationApiWithAuth(
      auth,
    ).registrationRequestregistrationcardprintPost({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      permno: permno,
    })
  }
}
